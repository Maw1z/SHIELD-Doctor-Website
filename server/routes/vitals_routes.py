from flask import Blueprint
from controllers.vitals_controller import (
    log_vitals_batch,
    get_vitals_history,
    get_latest_vitals
)

vitals_bp = Blueprint('vitals', __name__)

@vitals_bp.route('/log_vitals', methods=['POST'])
def post_vitals():
    return log_vitals_batch()

@vitals_bp.route('/vitals-history', methods=['GET'])
def get_history():
    return get_vitals_history()

@vitals_bp.route('/vitals-latest', methods=['GET'])
def get_latest():
    return get_latest_vitals()