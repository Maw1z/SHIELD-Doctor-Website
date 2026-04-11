from flask import jsonify, request
from app.db import get_db_connection
import logging
from firebase_admin import auth


# Create POST doctor api endpoint
def create_doctor():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        doctor_id = decoded_token['uid'] 
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

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
def get_patients_for_doctor():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        doctor_uuid = decoded_token['uid'] 
    except:
        return jsonify({"error": "Invalid token"}), 401

    if not doctor_uuid:
        return jsonify({
            "error": "Validation Error",
            "message": "doctor_uuid query parameter is required"
        }), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT DISTINCT ON (p.uuid)
                p.uuid,
                p.name,
                p.dob,
                p.height,
                p.weight,
                p.gender,
                p.phone_number,
                r.risk_score,
                (SELECT appointment_datetime 
                FROM appointments 
                WHERE patient_id = p.uuid 
                AND appointment_datetime < NOW() 
                ORDER BY appointment_datetime DESC LIMIT 1) as last_seen,
                r.risk_label
            FROM patients p
            JOIN doctor_assigned d ON p.uuid = d.patient_id
            LEFT JOIN risk_assessments r ON p.uuid = r.patient_id
            WHERE d.doctor_id = %s
            ORDER BY p.uuid, r.created_at DESC
        """, (doctor_uuid,))

        patients = cur.fetchall()

    except Exception as e:
        logging.error(f"Error fetching patients: {e}")
        return jsonify({"error": "Internal server error"}), 500

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
                "last_seen": p[8].isoformat() if p[8] else None,
                "risk_label": p[9] if p[9] else "Stable" 
            }
            for p in patients
        ]
    }), 200