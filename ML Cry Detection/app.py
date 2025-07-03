from flask import Flask, request, jsonify
from firebase_config import init_firestore
from ml_model import run_model
from volume_booster import boost_volume
import wave
import os
from threading import Timer
from flask import send_file

app = Flask(__name__)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

@app.route('/upload_raw', methods=['POST'])
def upload_raw():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'No userId provided'}), 400

    raw_data = request.data
    input_path = f"{UPLOAD_DIR}/{user_id}_input.wav"
    boosted_path = f"{UPLOAD_DIR}/{user_id}_boosted.wav"

    # Save raw PCM as WAV
    try:
        with wave.open(input_path, 'wb') as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)  # 16-bit
            wav.setframerate(8000)
            wav.writeframes(raw_data)

        boost_volume(input_path, boosted_path, gain=10)
        # result = run_model(boosted_path)
        result = False

        if result:
            user_ref = db.collection('users').document(user_id)
            user_ref.update({'cryDetected': True})
            Timer(600, reset_detection, args=(user_id,)).start()

        return jsonify({'status': 'success', 'userId': user_id, 'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Only for removing the file.
    # finally:
    #     for f in [input_path, boosted_path]:
    #         if os.path.exists(f):
    #             os.remove(f)


@app.route('/download_audio')
def download_audio():
    user_id = request.args.get('userId')
    version = request.args.get('version', 'boosted')  # 'input' or 'boosted'

    filename = f"{UPLOAD_DIR}/{user_id}_{version}.wav"
    if not os.path.exists(filename):
        return jsonify({'error': 'File not found'}), 404

    return send_file(filename, as_attachment=True)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
