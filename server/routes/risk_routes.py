from flask import Blueprint
from controllers.risk_controller import (
    log_risk,
    get_risk_history,
    get_latest_risk
)

risk_bp = Blueprint('risk', __name__)

@risk_bp.route('/api/v1/risk-scores', methods=['POST'])
def post_risk():
    return log_risk()

@risk_bp.route('/api/v1/risk-history', methods=['GET'])
def get_history():
    return get_risk_history()

@risk_bp.route('/api/v1/risk-latest', methods=['GET'])
def get_latest():
    return get_latest_risk()