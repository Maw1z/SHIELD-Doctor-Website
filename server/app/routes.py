from app import app
from flask import jsonify
from app.db import get_db_connection

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to the SHIELD Doctor API!"
        }), 200

@app.route('/test')
def test_route():
    return jsonify({
        "status": "success",
        "message": "Test route is working!"
        }), 200

@app.route('/test-db')
def test_db_connection():
    conn = get_db_connection()
    if conn:
        cur = conn.cursor()
        
        cur.execute("SELECT version();")
        result = cur.fetchone()
        
        cur.close()
        conn.close()
        return jsonify({
            "status": "success",
            "message": f"Database connected successfully! Version: {result[0]}"
            }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "Failed to connect to the database."
            }), 500