from flask import json, jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor


# Creating POST risk scores route
def log_risk():
    data_list = request.json
    if not isinstance(data_list, list):
        data_list = [data_list]

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        query = """
            INSERT INTO risk_assessments 
            (patient_id, risk_score, risk_label, reason_codes, created_at) 
            VALUES (%s, %s, %s, %s, %s);
        """
        
        batch_data = [
            (
                d['patient_id'],
                d['risk_score'],
                d['risk_label'],
                json.dumps(d.get('reason_codes', [])),
                d.get('created_at') 
            ) for d in data_list
        ]

        cur.executemany(query, batch_data)
        conn.commit()
        return jsonify({"message": f"Successfully logged {len(batch_data)} risk assessments"}), 201
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 400
    finally:
        if conn: 
            conn.close()

# Create GET risk history endpoint
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