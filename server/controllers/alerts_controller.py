from flask import jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor
import logging
import decimal
from datetime import datetime
from firebase_admin import auth


def get_alerts_for_doctor():
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
        return jsonify({"error": "doctor_id is required"}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            SELECT 
                a.alert_id,
                a.patient_id,
                p.name as patient_name,
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
            ORDER BY a.triggered_at DESC;
        """
        
        cur.execute(query, (doctor_id,))
        results = cur.fetchall()

        # Format timestamps and decimals for JSON
        for row in results:
            if row['triggered_at']:
                row['triggered_at'] = row['triggered_at'].isoformat()
            if isinstance(row['vital_value'], decimal.Decimal):
                row['vital_value'] = float(row['vital_value'])
            if isinstance(row['threshold_value'], decimal.Decimal):
                row['threshold_value'] = float(row['threshold_value'])

        return jsonify(results), 200

    except Exception as e:
        logging.error(f"Error fetching alerts: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

def log_alerts():
    data_list = request.json
    if not isinstance(data_list, list):
        data_list = [data_list]

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        # Note: 'acknowledged' is handled locally, but we store it for the doctor portal
        query = """
            INSERT INTO vital_alerts 
            (patient_id, alert_type, vital_value, threshold_value, activity_level, triggered_at) 
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        
        batch_data = [
            (
                d['patient_id'],
                d['alert_type'],
                d['vital_value'],
                d['threshold_value'],
                d.get('activity_level', 'REST'),
                d.get('triggered_at', datetime.now()) 
            ) for d in data_list
        ]
        
        cur.executemany(query, batch_data)
        conn.commit()
        return jsonify({"message": f"Successfully synced {len(batch_data)} alerts"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if conn: 
            conn.close()