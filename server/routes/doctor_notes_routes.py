from flask import Blueprint
from controllers.doctor_notes_controller import (
    create_note,
    update_note,
    delete_note
)

notes_bp = Blueprint('notes_bp', __name__)

@notes_bp.route('/notes', methods=['POST'])
def create():
    return create_note()

@notes_bp.route('/notes/<int:note_id>', methods=['PUT'])
def update(note_id):
    return update_note(note_id)

@notes_bp.route('/notes/<int:note_id>', methods=['DELETE'])
def delete(note_id):
    return delete_note(note_id)