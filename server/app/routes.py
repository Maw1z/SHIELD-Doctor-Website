from app import app
from flask import jsonify
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