from flask import jsonify, request
from app.db import get_db_connection
import logging
from firebase_admin import auth


def get_auth_uid():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None, (jsonify({"error": "Unauthorized"}), 401)
    try:
        id_token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"], None
    except Exception:
        return None, (jsonify({"error": "Invalid token"}), 401)


def create_note():
    doctor_id, err = get_auth_uid()
    if err:
        return err

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    patient_id = data.get("patient_id")
    note_title = data.get("note_title", "")
    note_content = data.get("note_content")

    if not patient_id or not note_content:
        return jsonify({"error": "patient_id and note_content are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO doctor_notes (patient_id, doctor_id, note_title, note_content)
            VALUES (%s, %s, %s, %s)
            RETURNING note_id, created_at
            """,
            (patient_id, doctor_id, note_title, note_content),
        )
        row = cur.fetchone()
        conn.commit()

        return jsonify({
            "status": "success",
            "note_id": row[0],
            "created_at": row[1].isoformat(),
        }), 201

    except Exception as e:
        conn.rollback()
        logging.error(f"Error creating note: {e}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        cur.close()
        conn.close()


def update_note(note_id):
    doctor_id, err = get_auth_uid()
    if err:
        return err

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    note_title = data.get("note_title", "")
    note_content = data.get("note_content")

    if not note_content:
        return jsonify({"error": "note_content is required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            UPDATE doctor_notes
            SET note_title = %s, note_content = %s
            WHERE note_id = %s AND doctor_id = %s
            RETURNING note_id
            """,
            (note_title, note_content, note_id, doctor_id),
        )
        if cur.fetchone() is None:
            return jsonify({"error": "Note not found or access denied"}), 404

        conn.commit()
        return jsonify({"status": "success"}), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error updating note: {e}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        cur.close()
        conn.close()


def delete_note(note_id):
    doctor_id, err = get_auth_uid()
    if err:
        return err

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            DELETE FROM doctor_notes
            WHERE note_id = %s AND doctor_id = %s
            RETURNING note_id
            """,
            (note_id, doctor_id),
        )
        if cur.fetchone() is None:
            return jsonify({"error": "Note not found or access denied"}), 404

        conn.commit()
        return jsonify({"status": "success"}), 200

    except Exception as e:
        conn.rollback()
        logging.error(f"Error deleting note: {e}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        cur.close()
        conn.close()