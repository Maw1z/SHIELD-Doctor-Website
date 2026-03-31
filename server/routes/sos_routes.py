from flask import Blueprint
from controllers.sos_controller import log_sos_event

sos_bp = Blueprint('sos', __name__)

@sos_bp.route('/api/v1/sos/event', methods=['POST'])
def post_sos_event():
    return log_sos_event()