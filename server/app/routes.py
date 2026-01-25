from app import app
from flask import json, jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor
import logging

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to the SHIELD Doctor API!"
        }), 200

# --- PATIENTS ---

# Create POST patient api endpoint
@app.route('/api/v1/patient', methods=['POST'])
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

# Create GET patient details based on UUID endpoint
@app.route('/api/v1/patient', methods=['GET'])
def get_patient_by_uuid():
    patient_uuid = request.args.get('uuid')
    if not patient_uuid:
        return jsonify({"error": "uuid is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT uuid, name, height, weight, dob, phone_number, email, gender
        FROM patients
        WHERE uuid = %s
    """, (patient_uuid,))

    patient = cur.fetchone()
    cur.close()
    conn.close()

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    return jsonify({
        "uuid": patient[0],
        "name": patient[1],
        "height": patient[2],
        "weight": patient[3],
        "dob": str(patient[4]),
        "phone_number": patient[5],
        "email": patient[6],
        "gender": patient[7]
    }), 200

# --- VITALS ---

# Creating POST log vitals route
@app.route('/api/v1/log_vitals', methods=['POST'])
def log_vital():
    data = request.json
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        query = """
            INSERT INTO vitals 
            (patient_id, heart_rate, hrv, spo2, bp_systolic, bp_diastolic, activity_level) 
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        cur.execute(query, (
            data['patient_id'],
            data.get('heart_rate'),
            data.get('hrv'),
            data.get('spo2'),
            data.get('bp_systolic'),
            data.get('bp_diastolic'),
            data.get('activity_level')
        ))
        conn.commit()
        return jsonify({"message": "Vitals logged successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if conn: 
            conn.close()

# Create GET vitals-history endpoint
@app.route('/api/v1/vitals-history', methods=['GET'])
def get_vitals_history():
    patient_id = request.args.get('patient_id')
    time_range = request.args.get('range', default='7D')

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    # determine if we need raw data or averaged data
    # anything <= 7 days is raw anything > 7 days is average
    is_long_term = time_range in ["4W", "6M", "1Y"]
    
    range_map = {
        "1H": "1 hour", "6H": "6 hours", "12H": "12 hours", "24H": "24 hours",
        "7D": "7 days", "4W": "4 weeks", "6M": "6 months", "1Y": "1 year"
    }
    history_interval = range_map.get(time_range, "7 days")

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if is_long_term:
            # LONG TERM: avg
            # this reduces 100k+ rows to a max of 365 rows
            query = f"""
                SELECT 
                    date_trunc('day', recorded_at) as time_label,
                    AVG(heart_rate)::integer as heart_rate,
                    AVG(hrv)::integer as hrv,
                    AVG(spo2)::numeric(5,2) as spo2,
                    AVG(bp_systolic)::integer as bp_systolic,
                    AVG(bp_diastolic)::integer as bp_diastolic
                FROM vitals
                WHERE patient_id = %s 
                AND recorded_at >= NOW() - INTERVAL '{history_interval}'
                GROUP BY time_label
                ORDER BY time_label ASC;
            """
        else:
            # SHORT TERM: raw data (every 5-min measurement)
            # for 7 days this is ~2,000 rows
            query = f"""
                SELECT 
                    recorded_at as time_label,
                    heart_rate, hrv, spo2, bp_systolic, bp_diastolic
                FROM vitals
                WHERE patient_id = %s 
                AND recorded_at >= NOW() - INTERVAL '{history_interval}'
                ORDER BY recorded_at ASC;
            """

        cur.execute(query, (patient_id,))
        results = cur.fetchall()

        formatted_vitals = []
        for row in results:
            # Helper to convert Decimal/None to safe JSON values
            def clean_val(val, is_int=True):
                if val is None: return 0
                if isinstance(val, decimal.Decimal):
                    return int(val) if is_int else float(val)
                return val
            
            formatted_vitals.append({
                'recorded_at': row['time_label'].isoformat() if row['time_label'] else None,
                'heart_rate': clean_val(row['heart_rate']),
                'hrv': clean_val(row['hrv']),
                'spo2': clean_val(row['spo2'], is_int=False),
                'bp_systolic': clean_val(row['bp_systolic']),
                'bp_diastolic': clean_val(row['bp_diastolic'])
            })

        return jsonify(formatted_vitals), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        if conn:
            conn.close()

# Create GET latest-vitals endpoint
@app.route('/api/v1/vitals-latest', methods=['GET'])
def get_latest_vitals():
    patient_id = request.args.get('patient_id')

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT *
            FROM vitals
            WHERE patient_id = %s
            ORDER BY recorded_at DESC
            LIMIT 1;
        """, (patient_id,))

        result = cur.fetchone()

        if result:
            result['recorded_at'] = result['recorded_at'].isoformat()
            return jsonify(result), 200
        else:
            return jsonify({"error": "No vitals found for the given patient_id"}), 404

    finally:
        if conn:
            conn.close()

# --- RISK ASSESSMENT ---

# Creating POST risk scores route
@app.route('/api/v1/risk-scores', methods=['POST'])
def log_risk():
    data = request.json
    conn = get_db_connection()
    try:
        cur = conn.cursor()

        # Convert Python list to JSON string for the database
        reason_codes_json = json.dumps(data.get('reason_codes', []))
        
        query = """
            INSERT INTO risk_assessments 
            (patient_id, risk_score, risk_label, reason_codes) 
            VALUES (%s, %s, %s, %s);
        """
        cur.execute(query, (
            data['patient_id'],
            data['risk_score'],
            data['risk_label'], # e.g., 'High', 'Medium'
            reason_codes_json
        ))
        conn.commit()
        return jsonify({"message": "Risk assessment saved"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if conn: 
            conn.close()

# Create GET risk history endpoint
@app.route('/api/v1/risk-history', methods=['GET'])
def get_risk_history():
    patient_id = request.args.get('patient_id')

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT *
            FROM risk_assessments
            WHERE patient_id = %s
            ORDER BY created_at DESC
            LIMIT 20;
        """, (patient_id,))

        results = cur.fetchall()

        for row in results:
            row['created_at'] = row['created_at'].isoformat()

        return jsonify(results), 200

    finally:
        if conn:
            conn.close()

# Create GET risk assessment latest endpoint
@app.route('/api/v1/risk-latest', methods=['GET'])
def get_latest_risk():
    patient_id = request.args.get('patient_id')

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute("""
            SELECT *
            FROM risk_assessments
            WHERE patient_id = %s
            ORDER BY created_at DESC
            LIMIT 1;
        """, (patient_id,))

        result = cur.fetchone()

        if not result:
            return jsonify({"message": "No risk assessments found"}), 404

        result['created_at'] = result['created_at'].isoformat()

        return jsonify(result), 200

    finally:
        if conn:
            conn.close()

# --- DOCTORS ---

# Create POST doctor api endpoint
@app.route('/api/v1/doctor', methods=['POST'])
def create_doctor():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    doctor_id = data.get('doctor_id')
    name = data.get('name')

    if not doctor_id or not name:
        return jsonify({"error": "doctor_id and name are required"}), 400

    specialization = data.get('specialization')
    phone_number = data.get('phone_number')
    email = data.get('email')

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO doctors
            (doctor_id, name, specialization, phone_number, email)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            doctor_id, name, specialization, phone_number, email
        ))

        conn.commit()

        return jsonify({
            "status": "success",
            "doctor_id": doctor_id
        }), 201

    except Exception as e:
        conn.rollback()
        logging.error(f"Error creating doctor: {e}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        cur.close()
        conn.close()

# Create GET patients assigned to doctor endpoint
@app.route('/api/v1/patient-doctor', methods=['GET'])
def get_patients_for_doctor():
    doctor_uuid = request.args.get('doctor_uuid')

    if not doctor_uuid:
        return jsonify({
            "error": "Validation Error",
            "message": "doctor_uuid query parameter is required"
        }), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                p.uuid,
                p.name,
                p.dob,
                p.height,
                p.weight,
                p.gender,
                p.phone_number,
                r.risk_score,
                a.patient_last_checked
            FROM patients p
            JOIN doctor_assigned d ON p.uuid = d.patient_id
            LEFT JOIN risk_assessments r ON p.uuid = r.patient_id
            LEFT JOIN appointments a ON p.uuid = a.patient_id
            WHERE d.doctor_id = %s
        """, (doctor_uuid,))

        patients = cur.fetchall()

    except Exception as e:
        # global handler deals with it
        raise e

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    if not patients:
        return jsonify({
            "doctor_uuid": doctor_uuid,
            "patients": [],
            "message": "No patients found for this doctor"
        }), 200

    return jsonify({
        "doctor_uuid": doctor_uuid,
        "patients": [
            {
                "uuid": p[0],
                "name": p[1],
                "dob": p[2].isoformat() if p[2] else None,
                "height": p[3],
                "weight": p[4],
                "gender": p[5],
                "phone_number": p[6],
                "risk_score": p[7],
                "patient_last_checked": p[8].isoformat() if p[8] else None
            }
            for p in patients
        ]
    }), 200

# --- ERROR HANDLERS ---

# Create Error Handlers
@app.errorhandler(400)
def bad_request(error):
    logging.warning(f"400 Bad Request: {error}")
    return jsonify({
        "error": "Bad Request",
        "message": "Invalid or missing request data"
    }), 400

@app.errorhandler(401)
def unauthorized(error):
    logging.warning(f"401 Unauthorized: {error}")
    return jsonify({
        "error": "Unauthorized",
        "message": "Authentication required"
    }), 401

@app.errorhandler(403)
def forbidden(error):
    logging.warning(f"403 Forbidden: {error}")
    return jsonify({
        "error": "Forbidden",
        "message": "You do not have permission to access this resource"
    }), 403

@app.errorhandler(404)
def not_found(error):
    logging.warning(f"404 Not Found: {error}")
    return jsonify({
        "error": "Not Found",
        "message": "The requested resource was not found"
    }), 404

@app.errorhandler(500)
def internal_server_error(error):
    logging.error(f"500 Internal Server Error: {error}")
    return jsonify({
        "error": "Internal Server Error",
        "message": "Something went wrong on the server"
    }), 500
