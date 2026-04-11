from flask import Blueprint
from controllers.sos_controller import (
    log_sos_event,
    get_sos_events_for_doctor,
    get_all_sos_events_for_responders
)

sos_bp = Blueprint('sos', __name__)

@sos_bp.route('/sos/doctor', methods=['GET'])
def get_doctor_sos():
    return get_sos_events_for_doctor()

@sos_bp.route('/sos/responder', methods=['GET'])
def get_responder_sos():
    return get_all_sos_events_for_responders()

@sos_bp.route('/sos/event', methods=['POST'])
def post_sos_event():
    return log_sos_event()