import os
from app import app
from flask import json, jsonify
import firebase_admin
from firebase_admin import auth, credentials
from dotenv import load_dotenv

# Register Blueprints
from routes.patient_routes import patient_bp
from routes.vitals_routes import vitals_bp
from routes.risk_routes import risk_bp
from routes.appointments_routes import appointments_bp
from routes.doctors_routes import doctors_bp
from routes.sos_routes import sos_bp
from routes.alerts_routes import alerts_bp

load_dotenv()

def initialize_firebase():
    if not firebase_admin._apps:
        service_account_info = os.getenv('FIREBASE_SERVICE_ACCOUNT')
        
        if service_account_info:
            # Load the JSON string into a Python dictionary
            cert_dict = json.loads(service_account_info)
            cred = credentials.Certificate(cert_dict)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin initialized via Environment Variable")
        else:
            # Fallback for local development using the file
            try:
                cred = credentials.Certificate("serviceAccountKey.json")
                firebase_admin.initialize_app(cred)
                print("Firebase Admin initialized via Local File")
            except Exception as e:
                print(f"Could not initialize Firebase: {e}")

initialize_firebase()

app.register_blueprint(patient_bp)
app.register_blueprint(vitals_bp)
app.register_blueprint(risk_bp)
app.register_blueprint(appointments_bp)
app.register_blueprint(doctors_bp)
app.register_blueprint(sos_bp)
app.register_blueprint(alerts_bp)

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to the SHIELD Doctor API!"
        }), 200

# --- ERROR HANDLERS ---

# Create Error Handlers
@app.errorhandler(400)
def bad_request(error):
    import logging
    logging.warning(f"400 Bad Request: {error}")
    return jsonify({
        "error": "Bad Request",
        "message": "Invalid or missing request data"
    }), 400

@app.errorhandler(401)
def unauthorized(error):
    import logging
    logging.warning(f"401 Unauthorized: {error}")
    return jsonify({
        "error": "Unauthorized",
        "message": "Authentication required"
    }), 401

@app.errorhandler(403)
def forbidden(error):
    import logging
    logging.warning(f"403 Forbidden: {error}")
    return jsonify({
        "error": "Forbidden",
        "message": "You do not have permission to access this resource"
    }), 403

@app.errorhandler(404)
def not_found(error):
    import logging
    logging.warning(f"404 Not Found: {error}")
    return jsonify({
        "error": "Not Found",
        "message": "The requested resource was not found"
    }), 404

@app.errorhandler(500)
def internal_server_error(error):
    import logging
    logging.error(f"500 Internal Server Error: {error}")
    return jsonify({
        "error": "Internal Server Error",
        "message": "Something went wrong on the server"
    }), 500