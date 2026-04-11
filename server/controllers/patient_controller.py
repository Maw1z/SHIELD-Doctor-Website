from flask import json, jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor
import logging
from datetime import date
from firebase_admin import auth


# Create POST patient api endpoint
def create_patient():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    patient_uuid = data.get('uuid')
    if not patient_uuid:
        return jsonify({"error": "uuid is required"}), 400

    name = data.get('name')
    dob = data.get('dob')

    if not name or not dob:
        return jsonify({"error": "name and dob are required"}), 400

    height = data.get('height')
    weight = data.get('weight')
    phone = data.get('phone_number')
    email = data.get('email')
    gender = data.get('gender')

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO patients
            (uuid, name, height, weight, dob, phone_number, email, gender)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            patient_uuid, name, height, weight, dob, phone, email, gender
        ))

        conn.commit()

        return jsonify({
            "status": "success",
            "patient_uuid": patient_uuid
        }), 201

    except Exception:
        conn.rollback()
        return jsonify({"error": "Internal server error"}), 500

    finally:
        cur.close()
        conn.close()

# Create GET patient details based on UUID endpoint (for doctor portal)
def get_patient_by_uuid():
    patient_uuid = request.args.get('uuid')
    
    # Get doctor_id from verified jwt
    auth_header = request.headers.get('Authorization')
    logging.info(f"Received request for patient {patient_uuid} with auth header: {auth_header}")


    if not auth_header: 
        return jsonify({"error": "No token"}), 401

    try:
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        doctor_id = decoded_token['uid'] 
    except Exception as e:
        logging.error(f"Firebase auth error: {e}")
        return jsonify({"error": "Invalid token"}), 401
    
    if not patient_uuid or not doctor_id:
        return jsonify({"error": "uuid and doctor_id are required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Check if patient is assigned to doctor
        cur.execute("""
            SELECT p.* 
            FROM patients p
            INNER JOIN doctor_assigned da ON p.uuid = da.patient_id
            WHERE p.uuid = %s AND da.doctor_id = %s
        """, (patient_uuid, doctor_id))
        
        patient = cur.fetchone()

        if not patient:
            return jsonify({"error": "Unauthorized: You do not have access to this patient"}), 403

        # Fetch Patient Basic Info & Risk Score
        cur.execute("""
            SELECT 
                uuid, name, height, weight, dob, 
                phone_number, email, gender
            FROM patients 
            WHERE uuid = %s
        """, (patient_uuid,))
        patient = cur.fetchone()

        if not patient:
            cur.close()
            conn.close()
            return jsonify({"message": "Patient not found"}), 404

        # Fetch Latest Risk & Reason Codes
        cur.execute("""
            SELECT risk_score, risk_label, reason_codes, created_at
            FROM risk_assessments 
            WHERE patient_id = %s
            ORDER BY created_at DESC LIMIT 1
        """, (patient_uuid,))
        latest_risk = cur.fetchone()

        # Fetch Daily Stats (Min, Max, Avg) for the last 24 hours
        cur.execute("""
            SELECT 
                MIN(risk_score) as min_score,
                MAX(risk_score) as max_score,
                AVG(risk_score) as avg_score
            FROM risk_assessments
            WHERE patient_id = %s AND created_at >= NOW() - INTERVAL '24 hours'
        """, (patient_uuid,))
        stats = cur.fetchone()

        # Fetch Alerts
        cur.execute("""
            SELECT 
                a.alert_id,
                a.alert_type,
                a.vital_value,
                a.threshold_value,
                a.activity_level,
                a.triggered_at,
                a.acknowledged
            FROM vital_alerts a
            JOIN patients p ON a.patient_id = p.uuid
            JOIN doctor_assigned da ON p.uuid = da.patient_id
            WHERE da.doctor_id = %s
            AND a.patient_id = %s
            ORDER BY a.triggered_at DESC;
        """, (doctor_id, patient_uuid))

        patient['alerts'] = cur.fetchall()

        # Fetch SOS alerts
        cur.execute("""
            SELECT 
                event_id, latitude, longitude, 
                vitals_snapshot, created_at 
            FROM sos_events 
            WHERE patient_id = %s
            ORDER BY created_at DESC
        """, (patient_uuid,))
        patient['sos_events'] = cur.fetchall()

        # Fetch Last Seen
        cur.execute("""
            SELECT appointment_datetime 
            FROM appointments 
            WHERE patient_id = %s AND doctor_id = %s 
            AND appointment_datetime < NOW()
            ORDER BY appointment_datetime DESC LIMIT 1
        """, (patient_uuid, doctor_id))
        last_seen = cur.fetchone()
        patient['last_seen'] = (
            last_seen['appointment_datetime'].isoformat() if last_seen else None
        )

        # Fetch Doctor Notes as an array
        cur.execute("""
            SELECT note_id, note_title, note_content, created_at 
            FROM doctor_notes 
            WHERE patient_id = %s AND doctor_id = %s
            ORDER BY created_at DESC
        """, (patient_uuid, doctor_id))
        patient['doctor_notes'] = cur.fetchall()

        # Fetch Upcoming Appointments as an array
        cur.execute("""
            SELECT appointment_id, title, appointment_datetime 
            FROM appointments 
            WHERE patient_id = %s AND doctor_id = %s
            AND appointment_datetime >= NOW()
            ORDER BY appointment_datetime ASC
        """, (patient_uuid, doctor_id))
        patient['upcoming_appointments'] = cur.fetchall()

        cur.close()
        conn.close()

        # Formatting for JSON compatibility
        if patient['dob']:
            patient['dob'] = str(patient['dob'])

        raw_reasons = latest_risk['reason_codes'] if latest_risk else []
        
        # If the database returned a string (JSON), parse it into a list
        if isinstance(raw_reasons, str):
            try:
                import json
                processed_reasons = json.loads(raw_reasons)
            except:
                processed_reasons = []
        else:
            processed_reasons = raw_reasons

        # Format Risk Assessment Data
        patient['risk_data'] = {
            "current": float(latest_risk['risk_score']) if latest_risk else 0,
            "label": latest_risk['risk_label'] if latest_risk else "N/A",
            "reasons": processed_reasons,
            "stats": {
                "min": float(stats['min_score']) if stats['min_score'] else 0,
                "max": float(stats['max_score']) if stats['max_score'] else 0,
                "avg": float(stats['avg_score']) if stats['avg_score'] else 0
            }
        }

        # Keep top-level legacy keys if your sidebar components still use them
        patient['risk_score'] = patient['risk_data']['current']
        patient['risk_label'] = patient['risk_data']['label']
            
        # Format Timestamps in Arrays
        for note in patient['doctor_notes']:
            note['created_at'] = note['created_at'].isoformat()
        for appt in patient['upcoming_appointments']:
            appt['appointment_datetime'] = appt['appointment_datetime'].isoformat()

        # Format Alerts
        for alert in patient['alerts']:
            alert['triggered_at'] = alert['triggered_at'].isoformat()

        # Format SOS Events 
        import decimal
        for sos in patient['sos_events']:
            sos['created_at'] = (
                sos['created_at'].isoformat() if sos['created_at'] else None
            )
            if isinstance(sos['latitude'], decimal.Decimal):
                sos['latitude'] = float(sos['latitude'])
            if isinstance(sos['longitude'], decimal.Decimal):
                sos['longitude'] = float(sos['longitude'])

        return jsonify(patient), 200

    except Exception as e:
        print(f"Error fetching patient: {e}")
        return jsonify({"error": str(e)}), 500

# GET patient details (for mobile app)
def get_basic_patient_details():
    patient_uuid = request.args.get('uuid')

    if not patient_uuid:
        return jsonify({"error": "uuid is required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT 
                name, height, weight, dob, 
                phone_number, email, gender
            FROM patients 
            WHERE uuid = %s
        """, (patient_uuid,))
        
        patient = cur.fetchone()

        cur.close()
        conn.close()

        if not patient:
            return jsonify({"message": "Patient not found"}), 404

        # Calculate age from DOB
        if patient['dob']:
            today = date.today()
            dob = patient['dob']
            age = (
                today.year - dob.year - 
                ((today.month, today.day) < (dob.month, dob.day))
            )
            patient['age'] = age
            # Convert date object to string for JSON serialization
            patient['dob'] = dob.isoformat()

        # Ensure numeric types are JSON serializable
        if patient['height']:
            patient['height'] = float(patient['height'])
        if patient['weight']:
            patient['weight'] = float(patient['weight'])

        return jsonify(patient), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500