from flask import jsonify, request
from app.db import get_db_connection
from psycopg2.extras import RealDictCursor
import decimal


# Creating POST log vitals route
def log_vitals_batch():
    data_list = request.json
    if not isinstance(data_list, list):
        data_list = [data_list] 

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        query = """
            INSERT INTO vitals 
            (patient_id, heart_rate, hrv, spo2, bp_systolic, bp_diastolic, activity_level, recorded_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        batch_data = [
            (
                d['patient_id'],
                d.get('heart_rate'),
                d.get('hrv'),
                d.get('spo2'),
                d.get('bp_systolic'),
                d.get('bp_diastolic'),
                d.get('activity_level'),
                d.get('recorded_at') 
            ) for d in data_list
        ]
        
        cur.executemany(query, batch_data)
        conn.commit()
        return jsonify({"message": f"Successfully logged {len(batch_data)} records"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        if conn: 
            conn.close()

# Create GET vitals-history endpoint
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