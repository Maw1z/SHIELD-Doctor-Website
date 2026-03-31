# import os
# from app import app
# from flask import json, jsonify, request
# from app.db import get_db_connection
# from psycopg2.extras import RealDictCursor
# import logging
# import decimal
# from datetime import datetime, date
# import firebase_admin
# from firebase_admin import auth, credentials

# from dotenv import load_dotenv

# load_dotenv()

# def initialize_firebase():
#     if not firebase_admin._apps:
#         service_account_info = os.getenv('FIREBASE_SERVICE_ACCOUNT')
        
#         if service_account_info:
#             # Load the JSON string into a Python dictionary
#             cert_dict = json.loads(service_account_info)
#             cred = credentials.Certificate(cert_dict)
#             firebase_admin.initialize_app(cred)
#             print("Firebase Admin initialized via Environment Variable")
#         else:
#             # Fallback for local development using the file
#             try:
#                 cred = credentials.Certificate("serviceAccountKey.json")
#                 firebase_admin.initialize_app(cred)
#                 print("Firebase Admin initialized via Local File")
#             except Exception as e:
#                 print(f"Could not initialize Firebase: {e}")

# initialize_firebase()

# @app.route('/')
# def home():
#     return jsonify({
#         "status": "success",
#         "message": "Welcome to the SHIELD Doctor API!"
#         }), 200

# # --- PATIENTS ---

# # Create POST patient api endpoint
# @app.route('/api/v1/patient', methods=['POST'])
# def create_patient():
#     data = request.get_json()

#     if not data:
#         return jsonify({"error": "Invalid or missing JSON body"}), 400

#     patient_uuid = data.get('uuid')
#     if not patient_uuid:
#         return jsonify({"error": "uuid is required"}), 400

#     name = data.get('name')
#     dob = data.get('dob')

#     if not name or not dob:
#         return jsonify({"error": "name and dob are required"}), 400

#     height = data.get('height')
#     weight = data.get('weight')
#     phone = data.get('phone_number')
#     email = data.get('email')
#     gender = data.get('gender')

#     conn = get_db_connection()
#     cur = conn.cursor()

#     try:
#         cur.execute("""
#             INSERT INTO patients
#             (uuid, name, height, weight, dob, phone_number, email, gender)
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#         """, (
#             patient_uuid, name, height, weight, dob, phone, email, gender
#         ))

#         conn.commit()

#         return jsonify({
#             "status": "success",
#             "patient_uuid": patient_uuid
#         }), 201

#     except Exception:
#         conn.rollback()
#         return jsonify({"error": "Internal server error"}), 500

#     finally:
#         cur.close()
#         conn.close()

# # Create GET patient details based on UUID endpoint (for doctor portal)
# @app.route('/api/v1/patient', methods=['GET'])
# def get_patient_by_uuid():
#     patient_uuid = request.args.get('uuid')
    
#     # Get doctor_id from verified jwt
#     auth_header = request.headers.get('Authorization')
#     logging.info(f"Received request for patient {patient_uuid} with auth header: {auth_header}")


#     if not auth_header: 
#         return jsonify({"error": "No token"}), 401

#     try:
#         id_token = auth_header.split('Bearer ')[1]
#         decoded_token = auth.verify_id_token(id_token)
#         doctor_id = decoded_token['uid'] 
#     except Exception as e:
#         logging.error(f"Firebase auth error: {e}")
#         return jsonify({"error": "Invalid token"}), 401
    
#     if not patient_uuid or not doctor_id:
#         return jsonify({"error": "uuid and doctor_id are required"}), 400

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         # Check if patient is assigned to doctor
#         cur.execute("""
#             SELECT p.* 
#             FROM patients p
#             INNER JOIN doctor_assigned da ON p.uuid = da.patient_id
#             WHERE p.uuid = %s AND da.doctor_id = %s
#         """, (patient_uuid, doctor_id))
        
#         patient = cur.fetchone()

#         if not patient:
#             return jsonify({"error": "Unauthorized: You do not have access to this patient"}), 403

#         # Fetch Patient Basic Info & Risk Score
#         cur.execute("""
#             SELECT 
#                 uuid, name, height, weight, dob, 
#                 phone_number, email, gender
#             FROM patients 
#             WHERE uuid = %s
#         """, (patient_uuid,))
#         patient = cur.fetchone()

#         if not patient:
#             cur.close()
#             conn.close()
#             return jsonify({"message": "Patient not found"}), 404

#         # Fetch Latest Risk & Reason Codes
#         cur.execute("""
#             SELECT risk_score, risk_label, reason_codes, created_at
#             FROM risk_assessments 
#             WHERE patient_id = %s
#             ORDER BY created_at DESC LIMIT 1
#         """, (patient_uuid,))
#         latest_risk = cur.fetchone()

#         # Fetch Daily Stats (Min, Max, Avg) for the last 24 hours
#         cur.execute("""
#             SELECT 
#                 MIN(risk_score) as min_score,
#                 MAX(risk_score) as max_score,
#                 AVG(risk_score) as avg_score
#             FROM risk_assessments
#             WHERE patient_id = %s AND created_at >= NOW() - INTERVAL '24 hours'
#         """, (patient_uuid,))
#         stats = cur.fetchone()

#         # Fetch Alerts
#         cur.execute("""
#             SELECT 
#                 a.alert_id,
#                 a.alert_type,
#                 a.vital_value,
#                 a.threshold_value,
#                 a.activity_level,
#                 a.triggered_at,
#                 a.acknowledged
#             FROM vital_alerts a
#             JOIN patients p ON a.patient_id = p.uuid
#             JOIN doctor_assigned da ON p.uuid = da.patient_id
#             WHERE da.doctor_id = %s
#             AND a.patient_id = %s
#             ORDER BY a.triggered_at DESC;
#         """, (doctor_id, patient_uuid))

#         patient['alerts'] = cur.fetchall()

#         # Fetch Last Seen
#         cur.execute("""
#             SELECT appointment_datetime 
#             FROM appointments 
#             WHERE patient_id = %s AND doctor_id = %s 
#             AND appointment_datetime < NOW()
#             ORDER BY appointment_datetime DESC LIMIT 1
#         """, (patient_uuid, doctor_id))
#         last_seen = cur.fetchone()
#         patient['last_seen'] = (
#             last_seen['appointment_datetime'].isoformat() if last_seen else None
#         )

#         # Fetch Doctor Notes as an array
#         cur.execute("""
#             SELECT note_id, note_title, note_content, created_at 
#             FROM doctor_notes 
#             WHERE patient_id = %s AND doctor_id = %s
#             ORDER BY created_at DESC
#         """, (patient_uuid, doctor_id))
#         patient['doctor_notes'] = cur.fetchall()

#         # Fetch Upcoming Appointments as an array
#         cur.execute("""
#             SELECT appointment_id, title, appointment_datetime 
#             FROM appointments 
#             WHERE patient_id = %s AND doctor_id = %s
#             AND appointment_datetime >= NOW()
#             ORDER BY appointment_datetime ASC
#         """, (patient_uuid, doctor_id))
#         patient['upcoming_appointments'] = cur.fetchall()

#         cur.close()
#         conn.close()

#         # Formatting for JSON compatibility
#         if patient['dob']:
#             patient['dob'] = str(patient['dob'])

#         raw_reasons = latest_risk['reason_codes'] if latest_risk else []
        
#         # If the database returned a string (JSON), parse it into a list
#         if isinstance(raw_reasons, str):
#             try:
#                 import json
#                 processed_reasons = json.loads(raw_reasons)
#             except:
#                 processed_reasons = []
#         else:
#             processed_reasons = raw_reasons

#         # Format Risk Assessment Data
#         patient['risk_data'] = {
#             "current": float(latest_risk['risk_score']) if latest_risk else 0,
#             "label": latest_risk['risk_label'] if latest_risk else "N/A",
#             "reasons": processed_reasons,
#             "stats": {
#                 "min": float(stats['min_score']) if stats['min_score'] else 0,
#                 "max": float(stats['max_score']) if stats['max_score'] else 0,
#                 "avg": float(stats['avg_score']) if stats['avg_score'] else 0
#             }
#         }

#         # Keep top-level legacy keys if your sidebar components still use them
#         patient['risk_score'] = patient['risk_data']['current']
#         patient['risk_label'] = patient['risk_data']['label']
            
#         # Format Timestamps in Arrays
#         for note in patient['doctor_notes']:
#             note['created_at'] = note['created_at'].isoformat()
#         for appt in patient['upcoming_appointments']:
#             appt['appointment_datetime'] = appt['appointment_datetime'].isoformat()

#         # Format Alerts
#         for alert in patient['alerts']:
#             alert['triggered_at'] = alert['triggered_at'].isoformat()

#         return jsonify(patient), 200

#     except Exception as e:
#         print(f"Error fetching patient: {e}")
#         return jsonify({"error": str(e)}), 500

# # GET patient details (for mobile app)
# @app.route('/api/v1/patient-details', methods=['GET'])
# def get_basic_patient_details():
#     patient_uuid = request.args.get('uuid')

#     if not patient_uuid:
#         return jsonify({"error": "uuid is required"}), 400

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         cur.execute("""
#             SELECT 
#                 name, height, weight, dob, 
#                 phone_number, email, gender
#             FROM patients 
#             WHERE uuid = %s
#         """, (patient_uuid,))
        
#         patient = cur.fetchone()

#         cur.close()
#         conn.close()

#         if not patient:
#             return jsonify({"message": "Patient not found"}), 404

#         # Calculate age from DOB
#         if patient['dob']:
#             today = date.today()
#             dob = patient['dob']
#             age = (
#                 today.year - dob.year - 
#                 ((today.month, today.day) < (dob.month, dob.day))
#             )
#             patient['age'] = age
#             # Convert date object to string for JSON serialization
#             patient['dob'] = dob.isoformat()

#         # Ensure numeric types are JSON serializable
#         if patient['height']:
#             patient['height'] = float(patient['height'])
#         if patient['weight']:
#             patient['weight'] = float(patient['weight'])

#         return jsonify(patient), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # --- VITALS ---

# # Creating POST log vitals route
# @app.route('/api/v1/log_vitals', methods=['POST'])
# def log_vitals_batch():
#     data_list = request.json
#     if not isinstance(data_list, list):
#         data_list = [data_list] 

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor()
#         query = """
#             INSERT INTO vitals 
#             (patient_id, heart_rate, hrv, spo2, bp_systolic, bp_diastolic, activity_level, recorded_at) 
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
#         """
        
#         batch_data = [
#             (
#                 d['patient_id'],
#                 d.get('heart_rate'),
#                 d.get('hrv'),
#                 d.get('spo2'),
#                 d.get('bp_systolic'),
#                 d.get('bp_diastolic'),
#                 d.get('activity_level'),
#                 d.get('recorded_at') 
#             ) for d in data_list
#         ]
        
#         cur.executemany(query, batch_data)
#         conn.commit()
#         return jsonify({"message": f"Successfully logged {len(batch_data)} records"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#     finally:
#         if conn: 
#             conn.close()

# # Create GET vitals-history endpoint
# @app.route('/api/v1/vitals-history', methods=['GET'])
# def get_vitals_history():
#     patient_id = request.args.get('patient_id')
#     time_range = request.args.get('range', default='7D')

#     if not patient_id:
#         return jsonify({"error": "patient_id is required"}), 400

#     # determine if we need raw data or averaged data
#     # anything <= 7 days is raw anything > 7 days is average
#     is_long_term = time_range in ["4W", "6M", "1Y"]
    
#     range_map = {
#         "1H": "1 hour", "6H": "6 hours", "12H": "12 hours", "24H": "24 hours",
#         "7D": "7 days", "4W": "4 weeks", "6M": "6 months", "1Y": "1 year"
#     }
#     history_interval = range_map.get(time_range, "7 days")

#     conn = None
#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         if is_long_term:
#             # LONG TERM: avg
#             # this reduces 100k+ rows to a max of 365 rows
#             query = f"""
#                 SELECT 
#                     date_trunc('day', recorded_at) as time_label,
#                     AVG(heart_rate)::integer as heart_rate,
#                     AVG(hrv)::integer as hrv,
#                     AVG(spo2)::numeric(5,2) as spo2,
#                     AVG(bp_systolic)::integer as bp_systolic,
#                     AVG(bp_diastolic)::integer as bp_diastolic
#                 FROM vitals
#                 WHERE patient_id = %s 
#                 AND recorded_at >= NOW() - INTERVAL '{history_interval}'
#                 GROUP BY time_label
#                 ORDER BY time_label ASC;
#             """
#         else:
#             # SHORT TERM: raw data (every 5-min measurement)
#             # for 7 days this is ~2,000 rows
#             query = f"""
#                 SELECT 
#                     recorded_at as time_label,
#                     heart_rate, hrv, spo2, bp_systolic, bp_diastolic
#                 FROM vitals
#                 WHERE patient_id = %s 
#                 AND recorded_at >= NOW() - INTERVAL '{history_interval}'
#                 ORDER BY recorded_at ASC;
#             """

#         cur.execute(query, (patient_id,))
#         results = cur.fetchall()

#         formatted_vitals = []
#         for row in results:
#             # Helper to convert Decimal/None to safe JSON values
#             def clean_val(val, is_int=True):
#                 if val is None: return 0
#                 if isinstance(val, decimal.Decimal):
#                     return int(val) if is_int else float(val)
#                 return val
            
#             formatted_vitals.append({
#                 'recorded_at': row['time_label'].isoformat() if row['time_label'] else None,
#                 'heart_rate': clean_val(row['heart_rate']),
#                 'hrv': clean_val(row['hrv']),
#                 'spo2': clean_val(row['spo2'], is_int=False),
#                 'bp_systolic': clean_val(row['bp_systolic']),
#                 'bp_diastolic': clean_val(row['bp_diastolic'])
#             })

#         return jsonify(formatted_vitals), 200

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": "Internal Server Error"}), 500
#     finally:
#         if conn:
#             conn.close()

# # Create GET latest-vitals endpoint
# @app.route('/api/v1/vitals-latest', methods=['GET'])
# def get_latest_vitals():
#     patient_id = request.args.get('patient_id')

#     if not patient_id:
#         return jsonify({"error": "patient_id is required"}), 400

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         cur.execute("""
#             SELECT *
#             FROM vitals
#             WHERE patient_id = %s
#             ORDER BY recorded_at DESC
#             LIMIT 1;
#         """, (patient_id,))

#         result = cur.fetchone()

#         if result:
#             result['recorded_at'] = result['recorded_at'].isoformat()
#             return jsonify(result), 200
#         else:
#             return jsonify({"error": "No vitals found for the given patient_id"}), 404

#     finally:
#         if conn:
#             conn.close()

# # --- RISK ASSESSMENT ---

# # Creating POST risk scores route
# @app.route('/api/v1/risk-scores', methods=['POST'])
# def log_risk():
#     data_list = request.json
#     if not isinstance(data_list, list):
#         data_list = [data_list]

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor()
#         query = """
#             INSERT INTO risk_assessments 
#             (patient_id, risk_score, risk_label, reason_codes, created_at) 
#             VALUES (%s, %s, %s, %s, %s);
#         """
        
#         batch_data = [
#             (
#                 d['patient_id'],
#                 d['risk_score'],
#                 d['risk_label'],
#                 json.dumps(d.get('reason_codes', [])),
#                 d.get('created_at') 
#             ) for d in data_list
#         ]

#         cur.executemany(query, batch_data)
#         conn.commit()
#         return jsonify({"message": f"Successfully logged {len(batch_data)} risk assessments"}), 201
#     except Exception as e:
#         print(f"Error: {e}") 
#         return jsonify({"error": str(e)}), 400
#     finally:
#         if conn: 
#             conn.close()

# # Create GET risk history endpoint
# @app.route('/api/v1/risk-history', methods=['GET'])
# def get_risk_history():
#     patient_id = request.args.get('patient_id')

#     if not patient_id:
#         return jsonify({"error": "patient_id is required"}), 400

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         cur.execute("""
#             SELECT *
#             FROM risk_assessments
#             WHERE patient_id = %s
#             ORDER BY created_at DESC
#             LIMIT 20;
#         """, (patient_id,))

#         results = cur.fetchall()

#         for row in results:
#             row['created_at'] = row['created_at'].isoformat()

#         return jsonify(results), 200

#     finally:
#         if conn:
#             conn.close()

# # Create GET risk assessment latest endpoint
# @app.route('/api/v1/risk-latest', methods=['GET'])
# def get_latest_risk():
#     patient_id = request.args.get('patient_id')

#     if not patient_id:
#         return jsonify({"error": "patient_id is required"}), 400

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         cur.execute("""
#             SELECT *
#             FROM risk_assessments
#             WHERE patient_id = %s
#             ORDER BY created_at DESC
#             LIMIT 1;
#         """, (patient_id,))

#         result = cur.fetchone()

#         if not result:
#             return jsonify({"message": "No risk assessments found"}), 404

#         result['created_at'] = result['created_at'].isoformat()

#         return jsonify(result), 200

#     finally:
#         if conn:
#             conn.close()

# # --- APPOINTMENTS ---

# # Create GET appointments (for doctor)
# @app.route('/api/v1/appointments', methods=['GET'])
# def get_appointments():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header: 
#         return jsonify({"error": "Unauthorized"}), 401
    
#     try:
#         id_token = auth_header.split('Bearer ')[1]
#         decoded_token = auth.verify_id_token(id_token)
#         doctor_id = decoded_token['uid'] 
#     except:
#         return jsonify({"error": "Invalid token"}), 401

#     if not doctor_id:
#         return jsonify({"error": "doctor_id query parameter is required"}), 400

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)
        
#         query = """
#             SELECT 
#                 a.appointment_id, 
#                 a.doctor_id, 
#                 a.patient_id, 
#                 p.name AS patient_name,
#                 a.title, 
#                 a.appointment_datetime, 
#                 (SELECT appointment_datetime 
#                 FROM appointments 
#                 WHERE patient_id = a.patient_id 
#                 AND appointment_datetime < a.appointment_datetime 
#                 ORDER BY appointment_datetime DESC LIMIT 1) as last_seen,
#                 a.created_at
#             FROM appointments a
#             INNER JOIN patients p ON a.patient_id = p.uuid
#             WHERE a.doctor_id = %s
#             ORDER BY a.appointment_datetime ASC
#         """
        
#         cur.execute(query, (doctor_id,))
#         rows = cur.fetchall()
        
#         # Convert datetime objects to ISO strings for JSON
#         for row in rows:
#             for k, v in row.items():
#                 if isinstance(v, datetime):
#                     row[k] = v.isoformat()
        
#         cur.close()
#         conn.close()
#         return jsonify(rows), 200
#     except Exception as e:
#         print(f"Database error: {e}")
#         return jsonify({"error": str(e)}), 500

# # Create GET appointments and notes (for patient)
# @app.route('/api/v1/appointments-patient', methods=['GET'])
# def get_appointments_patient():
#     patient_id = request.args.get('patient_id')
    
#     if not patient_id:
#         return jsonify({"error": "patient_id is required"}), 400

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         cur.execute("""
#             SELECT 
#                 a.appointment_id,
#                 a.doctor_id,
#                 a.title,
#                 a.appointment_datetime,
#                 d.name as doctor_name,
#                 d.specialization as doctor_specialization
#             FROM appointments a
#             JOIN doctors d ON a.doctor_id = d.doctor_id
#             WHERE a.patient_id = %s 
#             AND a.appointment_datetime >= NOW()
#             ORDER BY a.appointment_datetime ASC
#         """, (patient_id,))
#         appointments = cur.fetchall()

#         cur.execute("""
#             SELECT 
#                 n.note_id,
#                 n.note_title,
#                 n.note_content,
#                 n.created_at,
#                 d.name as doctor_name,
#                 d.specialization as doctor_specialization
#             FROM doctor_notes n
#             JOIN doctors d ON n.doctor_id = d.doctor_id
#             WHERE n.patient_id = %s
#             ORDER BY n.created_at DESC
#         """, (patient_id,))
#         notes = cur.fetchall()

#         # Clean timestamps for JSON
#         for appt in appointments:
#             appt['appointment_datetime'] = appt['appointment_datetime'].isoformat()
        
#         for note in notes:
#             note['created_at'] = note['created_at'].isoformat()

#         return jsonify({
#             "appointments": appointments,
#             "doctor_notes": notes
#         }), 200

#     except Exception as e:
#         logging.error(f"Error fetching patient consultations: {e}")
#         return jsonify({"error": "Internal server error"}), 500
#     finally:
#         cur.close()
#         conn.close()

# # Create POST appointments
# @app.route('/api/v1/appointments', methods=['POST'])
# def create_appointment():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header: 
#         return jsonify({"error": "Unauthorized"}), 401
    
#     try:
#         id_token = auth_header.split('Bearer ')[1]
#         decoded_token = auth.verify_id_token(id_token)
#         doctor_id = decoded_token['uid'] 
#     except:
#         return jsonify({"error": "Invalid token"}), 401

#     data = request.json

#     required_fields = ['patient_id', 'title', 'appointment_datetime']
#     if not all(field in data for field in required_fields):
#         return jsonify({"error": "Missing required fields"}), 400

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor(cursor_factory=RealDictCursor)
        
#         # Verify Doctor-Patient Relationship
#         cur.execute("""
#             SELECT 1 FROM doctor_assigned 
#             WHERE doctor_id = %s AND patient_id = %s
#         """, (doctor_id, data['patient_id']))
        
#         if not cur.fetchone():
#             return jsonify({"error": "You are not authorized to book for this patient"}), 403

#         # INSERT using the 'doctor_id' from the TOKEN
#         query = """
#             INSERT INTO appointments (doctor_id, patient_id, title, appointment_datetime)
#             VALUES (%s, %s, %s, %s)
#             RETURNING *;
#         """
#         cur.execute(query, (
#             doctor_id, 
#             data['patient_id'], 
#             data['title'], 
#             data['appointment_datetime']
#         ))
        
#         new_appointment = cur.fetchone()
#         conn.commit()
#         cur.close()
#         conn.close()

#         # Convert datetimes
#         for key, value in new_appointment.items():
#             if isinstance(value, datetime):
#                 new_appointment[key] = value.isoformat()

#         return jsonify(new_appointment), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # --- DOCTORS ---

# # Create POST doctor api endpoint
# @app.route('/api/v1/doctor', methods=['POST'])
# def create_doctor():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header: 
#         return jsonify({"error": "Unauthorized"}), 401
    
#     try:
#         id_token = auth_header.split('Bearer ')[1]
#         decoded_token = auth.verify_id_token(id_token)
#         doctor_id = decoded_token['uid'] 
#     except:
#         return jsonify({"error": "Invalid token"}), 401

#     data = request.get_json()

#     if not data:
#         return jsonify({"error": "Invalid or missing JSON body"}), 400

#     name = data.get('name')

#     if not doctor_id or not name:
#         return jsonify({"error": "doctor_id and name are required"}), 400

#     specialization = data.get('specialization')
#     phone_number = data.get('phone_number')
#     email = data.get('email')

#     conn = get_db_connection()
#     cur = conn.cursor()

#     try:
#         cur.execute("""
#             INSERT INTO doctors
#             (doctor_id, name, specialization, phone_number, email)
#             VALUES (%s, %s, %s, %s, %s)
#         """, (
#             doctor_id, name, specialization, phone_number, email
#         ))

#         conn.commit()

#         return jsonify({
#             "status": "success",
#             "doctor_id": doctor_id
#         }), 201

#     except Exception as e:
#         conn.rollback()
#         logging.error(f"Error creating doctor: {e}")
#         return jsonify({"error": "Internal server error"}), 500

#     finally:
#         cur.close()
#         conn.close()

# # Create GET patients assigned to doctor endpoint
# @app.route('/api/v1/patient-doctor', methods=['GET'])
# def get_patients_for_doctor():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header: 
#         return jsonify({"error": "Unauthorized"}), 401
    
#     try:
#         id_token = auth_header.split('Bearer ')[1]
#         decoded_token = auth.verify_id_token(id_token)
#         doctor_uuid = decoded_token['uid'] 
#     except:
#         return jsonify({"error": "Invalid token"}), 401

#     if not doctor_uuid:
#         return jsonify({
#             "error": "Validation Error",
#             "message": "doctor_uuid query parameter is required"
#         }), 400

#     try:
#         conn = get_db_connection()
#         cur = conn.cursor()

#         cur.execute("""
#             SELECT DISTINCT ON (p.uuid)
#                 p.uuid,
#                 p.name,
#                 p.dob,
#                 p.height,
#                 p.weight,
#                 p.gender,
#                 p.phone_number,
#                 r.risk_score,
#                 (SELECT appointment_datetime 
#                 FROM appointments 
#                 WHERE patient_id = p.uuid 
#                 AND appointment_datetime < NOW() 
#                 ORDER BY appointment_datetime DESC LIMIT 1) as last_seen
#             FROM patients p
#             JOIN doctor_assigned d ON p.uuid = d.patient_id
#             LEFT JOIN risk_assessments r ON p.uuid = r.patient_id
#             WHERE d.doctor_id = %s
#             ORDER BY p.uuid
#         """, (doctor_uuid,))

#         patients = cur.fetchall()

#     except Exception as e:
#         # global handler deals with it
#         raise e

#     finally:
#         if cur:
#             cur.close()
#         if conn:
#             conn.close()

#     if not patients:
#         return jsonify({
#             "doctor_uuid": doctor_uuid,
#             "patients": [],
#             "message": "No patients found for this doctor"
#         }), 200

#     return jsonify({
#         "doctor_uuid": doctor_uuid,
#         "patients": [
#             {
#                 "uuid": p[0],
#                 "name": p[1],
#                 "dob": p[2].isoformat() if p[2] else None,
#                 "height": p[3],
#                 "weight": p[4],
#                 "gender": p[5],
#                 "phone_number": p[6],
#                 "risk_score": p[7],
#                 "last_seen": p[8].isoformat() if p[8] else None
#             }
#             for p in patients
#         ]
#     }), 200

# # --- SOS EVENTS ---

# @app.route('/api/v1/sos/event', methods=['POST'])
# def log_sos_event():
#     data = request.get_json()
#     patient_id = data.get('patient_id')
#     lat = data.get('latitude')
#     lng = data.get('longitude')
#     vitals = data.get('vitals_snapshot') 

#     if not patient_id:
#         return jsonify({"error": "patient_id is required"}), 400

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)
        
#         cur.execute("""
#             INSERT INTO sos_events (patient_id, latitude, longitude, vitals_snapshot)
#             VALUES (%s, %s, %s, %s)
#             RETURNING event_id;
#         """, (patient_id, lat, lng, json.dumps(vitals)))
        
#         event_id = cur.fetchone()['event_id']
        
#         cur.execute("SELECT name, phone_number FROM emergency_contacts WHERE patient_id = %s", (patient_id,))
#         contacts = cur.fetchall()
        
#         conn.commit()
#         return jsonify({
#             "status": "success", 
#             "event_id": event_id,
#             "alerted_contacts": contacts
#         }), 201
#     except Exception as e:
#         if conn: 
#             conn.rollback()
#         return jsonify({"error": str(e)}), 500
#     finally:
#         conn.close()

# # --- ALERTS ---

# @app.route('/api/v1/alerts', methods=['GET'])
# def get_alerts_for_doctor():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header: 
#         return jsonify({"error": "Unauthorized"}), 401
    
#     try:
#         id_token = auth_header.split('Bearer ')[1]
#         decoded_token = auth.verify_id_token(id_token)
#         doctor_id = decoded_token['uid'] 
#     except:
#         return jsonify({"error": "Invalid token"}), 401

#     if not doctor_id:
#         return jsonify({"error": "doctor_id is required"}), 400

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor(cursor_factory=RealDictCursor)

#         query = """
#             SELECT 
#                 a.alert_id,
#                 a.patient_id,
#                 p.name as patient_name,
#                 a.alert_type,
#                 a.vital_value,
#                 a.threshold_value,
#                 a.activity_level,
#                 a.triggered_at,
#                 a.acknowledged
#             FROM vital_alerts a
#             JOIN patients p ON a.patient_id = p.uuid
#             JOIN doctor_assigned da ON p.uuid = da.patient_id
#             WHERE da.doctor_id = %s
#             ORDER BY a.triggered_at DESC;
#         """
        
#         cur.execute(query, (doctor_id,))
#         results = cur.fetchall()

#         # Format timestamps and decimals for JSON
#         for row in results:
#             if row['triggered_at']:
#                 row['triggered_at'] = row['triggered_at'].isoformat()
#             if isinstance(row['vital_value'], decimal.Decimal):
#                 row['vital_value'] = float(row['vital_value'])
#             if isinstance(row['threshold_value'], decimal.Decimal):
#                 row['threshold_value'] = float(row['threshold_value'])

#         return jsonify(results), 200

#     except Exception as e:
#         logging.error(f"Error fetching alerts: {e}")
#         return jsonify({"error": str(e)}), 500
#     finally:
#         if conn:
#             conn.close()

# @app.route('/api/v1/alerts', methods=['POST'])
# def log_alerts():
#     data_list = request.json
#     if not isinstance(data_list, list):
#         data_list = [data_list]

#     conn = get_db_connection()
#     try:
#         cur = conn.cursor()
#         # Note: 'acknowledged' is handled locally, but we store it for the doctor portal
#         query = """
#             INSERT INTO vital_alerts 
#             (patient_id, alert_type, vital_value, threshold_value, activity_level, triggered_at) 
#             VALUES (%s, %s, %s, %s, %s, %s);
#         """
        
#         batch_data = [
#             (
#                 d['patient_id'],
#                 d['alert_type'],
#                 d['vital_value'],
#                 d['threshold_value'],
#                 d.get('activity_level', 'REST'),
#                 d.get('triggered_at', datetime.now()) 
#             ) for d in data_list
#         ]
        
#         cur.executemany(query, batch_data)
#         conn.commit()
#         return jsonify({"message": f"Successfully synced {len(batch_data)} alerts"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400
#     finally:
#         if conn: 
#             conn.close()

# # --- ERROR HANDLERS ---

# # Create Error Handlers
# @app.errorhandler(400)
# def bad_request(error):
#     logging.warning(f"400 Bad Request: {error}")
#     return jsonify({
#         "error": "Bad Request",
#         "message": "Invalid or missing request data"
#     }), 400

# @app.errorhandler(401)
# def unauthorized(error):
#     logging.warning(f"401 Unauthorized: {error}")
#     return jsonify({
#         "error": "Unauthorized",
#         "message": "Authentication required"
#     }), 401

# @app.errorhandler(403)
# def forbidden(error):
#     logging.warning(f"403 Forbidden: {error}")
#     return jsonify({
#         "error": "Forbidden",
#         "message": "You do not have permission to access this resource"
#     }), 403

# @app.errorhandler(404)
# def not_found(error):
#     logging.warning(f"404 Not Found: {error}")
#     return jsonify({
#         "error": "Not Found",
#         "message": "The requested resource was not found"
#     }), 404

# @app.errorhandler(500)
# def internal_server_error(error):
#     logging.error(f"500 Internal Server Error: {error}")
#     return jsonify({
#         "error": "Internal Server Error",
#         "message": "Something went wrong on the server"
#     }), 500
