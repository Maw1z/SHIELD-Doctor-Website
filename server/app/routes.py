from app import app
from flask import jsonify, request
from app.db import get_db_connection

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to the SHIELD Doctor API!"
        }), 200

@app.route('/users')
def test_db_connection():
    conn = get_db_connection() 
    if conn: 
        cur = conn.cursor() 
        try: 
            cur.execute("SELECT * FROM users;") 
            result = cur.fetchone() 
            cur.close() 
            conn.close() 
            
            return jsonify({ "status": "success", "message": f"Users retrieved successfully! First row: {result}" }), 200 
        except Exception as e: 
            return jsonify({ "status": "error", "message": f"Query failed: {e}" }), 500 
    else: 
        return jsonify({ "status": "error", "message": "Failed to connect to the database." }), 500

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
        if conn: conn.close()