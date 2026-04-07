from flask import Blueprint
from controllers.doctors_controller import (
    create_doctor,
    get_patients_for_doctor
)

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('/doctor', methods=['POST'])
def post_doctor():
    return create_doctor()

@doctors_bp.route('/patient-doctor', methods=['GET'])
def get_doctor_patients():
    return get_patients_for_doctor()