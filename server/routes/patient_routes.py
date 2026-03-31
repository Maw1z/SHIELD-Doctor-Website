from flask import Blueprint
from controllers.patient_controller import (
    create_patient,
    get_patient_by_uuid,
    get_basic_patient_details
)

patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/api/v1/patient', methods=['POST'])
def post_patient():
    return create_patient()

@patient_bp.route('/api/v1/patient', methods=['GET'])
def get_patient():
    return get_patient_by_uuid()

@patient_bp.route('/api/v1/patient-details', methods=['GET'])
def get_patient_details():
    return get_basic_patient_details()