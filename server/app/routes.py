from app import app
from flask import json, jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor
import logging
import uuid

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
        if conn: 
            conn.close()

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

# Create GET vitals-history endpoint
@app.route('/api/v1/vitals-history', methods=['GET'])
def get_vitals_history():
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
            LIMIT 50;
        """, (patient_id,))

        results = cur.fetchall()

        for row in results:
            row['recorded_at'] = row['recorded_at'].isoformat()

        return jsonify(results), 200

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

#Create POST patient api endpoint
@app.route('/api/v1/patient', methods=['POST'])
def create_patient():
    data = request.get_json()

    patient_uuid = str(uuid.uuid4())
    name = data['name']
    age = data['age']
    height = data['height']
    weight = data['weight']
    dob = data['dob']
    phone = data['phone_number']
    email = data['email']

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO patients 
            (uuid, name, age, height, weight, dob, phone_number, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            patient_uuid, name, age, height, weight, dob, phone, email
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "status": "success",
            "patient_uuid": patient_uuid
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

# Create GET patient details based on UUID endpoint
@app.route('/api/v1/patient', methods=['GET'])
def get_patient_by_uuid():
    patient_uuid = request.args.get('uuid')

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT uuid, name, age, height, weight, dob, phone_number, email
        FROM patients
        WHERE uuid = %s
    """, (patient_uuid,))

    patient = cur.fetchone()
    cur.close()
    conn.close()

    if patient:
        return jsonify({
            "uuid": patient[0],
            "name": patient[1],
            "age": patient[2],
            "height": patient[3],
            "weight": patient[4],
            "dob": str(patient[5]),
            "phone_number": patient[6],
            "email": patient[7]
        }), 200
    else:
        return jsonify({"message": "Patient not found"}), 404

# Create GET patients assigned to doctor endpoint
@app.route('/api/v1/patient-doctor', methods=['POST'])
def get_patients_for_doctor():
    data = request.get_json()
    doctor_id = data['doctor_id']

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT p.uuid, p.name, p.age
        FROM patients p
        JOIN DoctorAssigned d
        ON p.uuid = d.patient_uuid
        WHERE d.doctor_id = %s
    """, (doctor_id,))

    patients = cur.fetchall()
    cur.close()
    conn.close()

    result = []
    for p in patients:
        result.append({
            "uuid": p[0],
            "name": p[1],
            "age": p[2]
        })

    return jsonify({
        "doctor_id": doctor_id,
        "patients": result
    }), 200

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

