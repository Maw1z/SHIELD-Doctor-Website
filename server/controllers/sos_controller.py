from flask import json, jsonify, request
from app.db import get_db_connection
import logging
from firebase_admin import auth
from psycopg2.extras import RealDictCursor

def get_sos_events_for_doctor():
    auth_header = request.headers.get('Authorization')
    if not auth_header: 
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        id_token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        doctor_uuid = decoded_token['uid'] 
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    patient_id = request.args.get('patient_id')
    if not patient_id:
        return jsonify({"error": "patient_id query parameter is required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT 1 FROM doctor_assigned 
            WHERE doctor_id = %s AND patient_id = %s
        """, (doctor_uuid, patient_id))
        
        if not cur.fetchone():
            return jsonify({
                "error": "Forbidden", 
                "message": "Access denied. You are not assigned to this patient."
            }), 403

        cur.execute("""
            SELECT 
                event_id, 
                latitude, 
                longitude, 
                vitals_snapshot, 
                created_at 
            FROM sos_events 
            WHERE patient_id = %s 
            ORDER BY created_at DESC
        """, (patient_id,))
        
        events = cur.fetchall()
        
        return jsonify({
            "doctor_id": doctor_uuid,
            "patient_id": patient_id,
            "events": events
        }), 200

    except Exception as e:
        logging.error(f"Error in get_sos_events_for_doctor: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        conn.close()

def get_all_sos_events_for_responders():
    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT 
                s.event_id, 
                s.patient_id, 
                p.name,
                p.phone_number,
                p.dob,
                p.gender,
                s.latitude, 
                s.longitude, 
                s.vitals_snapshot, 
                s.created_at
            FROM sos_events s
            LEFT JOIN patients p ON s.patient_id = p.uuid
            ORDER BY s.created_at DESC
        """)
        
        events = cur.fetchall()

        # Formatting date objects for JSON compatibility
        for event in events:
            if event['dob']:
                event['dob'] = event['dob'].isoformat()
            if event['created_at']:
                event['created_at'] = event['created_at'].isoformat()

        return jsonify({
            "status": "success",
            "count": len(events),
            "events": events
        }), 200

    except Exception as e:
        logging.error(f"Error in get_all_sos_events_for_responders: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        conn.close()


def log_sos_event():
    conn = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        patient_id = data.get('patient_id')
        lat = data.get('latitude')
        lng = data.get('longitude')
        vitals = data.get('vitals_snapshot') 

        if not patient_id:
            return jsonify({"error": "patient_id is required"}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        vitals_json = json.dumps(vitals) if vitals else None

        cur.execute("""
            INSERT INTO sos_events (patient_id, latitude, longitude, vitals_snapshot)
            VALUES (%s, %s, %s, %s)
            RETURNING event_id;
        """, (patient_id, lat, lng, vitals_json))
        
        result = cur.fetchone()
        if not result:
            raise Exception("Failed to retrieve event_id after insert")
            
        event_id = result['event_id']
        
        conn.commit()
        return jsonify({
            "status": "success", 
            "event_id": event_id,
        }), 201
    except Exception as e:
        if conn: 
            conn.rollback()
        logging.error(f"SOS Error: {str(e)}") 
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()