from flask import jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor
import logging
from datetime import datetime
from firebase_admin import auth


# Create GET appointments (for doctor)
def get_appointments():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        doctor_id = decoded_token['uid'] 
    except:
        return jsonify({"error": "Invalid token"}), 401

    if not doctor_id:
        return jsonify({"error": "doctor_id query parameter is required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                a.appointment_id, 
                a.doctor_id, 
                a.patient_id, 
                p.name AS patient_name,
                a.title, 
                a.appointment_datetime, 
                (SELECT appointment_datetime 
                FROM appointments 
                WHERE patient_id = a.patient_id 
                AND appointment_datetime < a.appointment_datetime 
                ORDER BY appointment_datetime DESC LIMIT 1) as last_seen,
                a.created_at
            FROM appointments a
            INNER JOIN patients p ON a.patient_id = p.uuid
            WHERE a.doctor_id = %s
            ORDER BY a.appointment_datetime ASC
        """
        
        cur.execute(query, (doctor_id,))
        rows = cur.fetchall()
        
        # Convert datetime objects to ISO strings for JSON
        for row in rows:
            for k, v in row.items():
                if isinstance(v, datetime):
                    row[k] = v.isoformat()
        
        cur.close()
        conn.close()
        return jsonify(rows), 200
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": str(e)}), 500

# Create GET appointments and notes (for patient)
def get_appointments_patient():
    patient_id = request.args.get('patient_id')

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    conn = get_db_connection()
    cur = None

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(
            """
            SELECT 1
            FROM doctor_assigned
            WHERE patient_id = %s
            LIMIT 1
            """,
            (patient_id,),
        )
        assignment = cur.fetchone()

        if not assignment:
            return (
                jsonify(
                    {
                        "appointments": [],
                        "doctor_notes": [],
                        "not_registered": True,
                        "message": (
                            "Sorry, you are not registered to a doctor yet "
                            "in the system. Please contact the administrator if you think is a mistake."
                        ),
                    }
                ),
                200,
            )

        cur.execute(
            """
            SELECT
                a.appointment_id,
                a.doctor_id,
                a.title,
                a.appointment_datetime,
                d.name AS doctor_name,
                d.specialization AS doctor_specialization
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.doctor_id
            WHERE a.patient_id = %s
            AND a.appointment_datetime >= NOW()
            ORDER BY a.appointment_datetime ASC
            """,
            (patient_id,),
        )
        appointments = cur.fetchall()

        # Fetch doctor notes
        cur.execute(
            """
            SELECT
                n.note_id,
                n.note_title,
                n.note_content,
                n.created_at,
                d.name AS doctor_name,
                d.specialization AS doctor_specialization
            FROM doctor_notes n
            JOIN doctors d ON n.doctor_id = d.doctor_id
            WHERE n.patient_id = %s
            ORDER BY n.created_at DESC
            """,
            (patient_id,),
        )
        notes = cur.fetchall()

        for appt in appointments:
            appt["appointment_datetime"] = appt[
                "appointment_datetime"
            ].isoformat()

        for note in notes:
            note["created_at"] = note["created_at"].isoformat()

        return (
            jsonify(
                {
                    "appointments": appointments,
                    "doctor_notes": notes,
                    "not_registered": False,
                    "message": None,
                }
            ),
            200,
        )

    except Exception as e:
        logging.error(f"Error fetching patient consultations: {e}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        if cur:
            cur.close()
        conn.close()

# Create POST appointments
def create_appointment():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        doctor_id = decoded_token['uid'] 
    except:
        return jsonify({"error": "Invalid token"}), 401

    data = request.json

    required_fields = ['patient_id', 'title', 'appointment_datetime']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Verify Doctor-Patient Relationship
        cur.execute("""
            SELECT 1 FROM doctor_assigned 
            WHERE doctor_id = %s AND patient_id = %s
        """, (doctor_id, data['patient_id']))
        
        if not cur.fetchone():
            return jsonify({"error": "You are not authorized to book for this patient"}), 403

        # INSERT using the 'doctor_id' from the TOKEN
        query = """
            INSERT INTO appointments (doctor_id, patient_id, title, appointment_datetime)
            VALUES (%s, %s, %s, %s)
            RETURNING *;
        """
        cur.execute(query, (
            doctor_id, 
            data['patient_id'], 
            data['title'], 
            data['appointment_datetime']
        ))
        
        new_appointment = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        # Convert datetimes
        for key, value in new_appointment.items():
            if isinstance(value, datetime):
                new_appointment[key] = value.isoformat()

        return jsonify(new_appointment), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500