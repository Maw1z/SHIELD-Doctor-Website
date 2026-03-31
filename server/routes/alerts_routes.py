from flask import Blueprint
from controllers.alerts_controller import (
    get_alerts_for_doctor,
    log_alerts
)

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('/api/v1/alerts', methods=['GET'])
def get_alerts():
    return get_alerts_for_doctor()

@alerts_bp.route('/api/v1/alerts', methods=['POST'])
def post_alerts():
    return log_alerts()