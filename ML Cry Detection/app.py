from flask import Flask, request, jsonify
from firebase_config import init_firestore
from ml_model import run_model
from utils import save_audio
import os
from threading import Timer


app = Flask(__name__)

# Initialize Firestore
db = init_firestore()

def reset_detection(user_id, delay=600):
    try:
        user_ref = db.collection('users').document(user_id)
        user_ref.update({'cryDetected': False})
        print(f"[INFO] Reset detection for user {user_id}")
    except Exception as e:
        print(f"[ERROR] Failed to reset detection: {e}")

@app.route('/')
def index():
    return "ESP32 Audio ML Server is running"


@app.route('/upload', methods=['POST'])
def handle_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    user_id = request.form.get('userId')
    if not user_id:
        return jsonify({'error': 'No userId provided'}), 400

    audio_file = request.files['file']
    filename = f"{user_id}_{audio_file.filename}"
    audio_path = save_audio(audio_file, filename)

    try:
        # Run ML model
        result = run_model(audio_path)

        if result:
            # Update Firestore only if result is True
            user_ref = db.collection('users').document(user_id)
            user_ref.update({'cryDetected': True})

            # Schedule reset after 10 minutes (600 seconds)
            Timer(600, reset_detection, args=(user_id,)).start()

        return jsonify({'status': 'success', 'userId': user_id, 'result': result})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Always delete the file after processing
        if os.path.exists(audio_path):
            os.remove(audio_path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)