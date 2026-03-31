from flask import Blueprint
from controllers.appointments_controller import (
    get_appointments,
    get_appointments_patient,
    create_appointment
)

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/api/v1/appointments', methods=['GET'])
def get_all_appointments():
    return get_appointments()

@appointments_bp.route('/api/v1/appointments-patient', methods=['GET'])
def get_patient_appointments():
    return get_appointments_patient()

@appointments_bp.route('/api/v1/appointments', methods=['POST'])
def post_appointment():
    return create_appointment()