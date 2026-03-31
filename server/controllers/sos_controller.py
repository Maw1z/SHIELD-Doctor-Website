from flask import json, jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor


def log_sos_event():
    data = request.get_json()
    patient_id = data.get('patient_id')
    lat = data.get('latitude')
    lng = data.get('longitude')
    vitals = data.get('vitals_snapshot') 

    if not patient_id:
        return jsonify({"error": "patient_id is required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            INSERT INTO sos_events (patient_id, latitude, longitude, vitals_snapshot)
            VALUES (%s, %s, %s, %s)
            RETURNING event_id;
        """, (patient_id, lat, lng, json.dumps(vitals)))
        
        event_id = cur.fetchone()['event_id']
        
        cur.execute("SELECT name, phone_number FROM emergency_contacts WHERE patient_id = %s", (patient_id,))
        contacts = cur.fetchall()
        
        conn.commit()
        return jsonify({
            "status": "success", 
            "event_id": event_id,
            "alerted_contacts": contacts
        }), 201
    except Exception as e:
        if conn: 
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()