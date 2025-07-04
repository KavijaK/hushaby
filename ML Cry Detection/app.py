from flask import Flask, request, jsonify
from firebase_config import init_firestore
from volume_booster import boost_volume
import wave
import os
from threading import Timer
import joblib
import librosa
import torch
import numpy as np
from transformers import Wav2Vec2Processor, Wav2Vec2Model


# ====== CONFIG ======
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model_name = "facebook/wav2vec2-base"
sample_rate = 16000  # Wav2Vec expects this

# ====== LOAD MODELS ======
processor = Wav2Vec2Processor.from_pretrained(model_name)
model = Wav2Vec2Model.from_pretrained(model_name).to(device).eval()


app = Flask(__name__)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

xgb_clf = joblib.load("xgb_baby_cry_model.joblib")

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
        result = predict_audio(boosted_path, xgb_clf)

        if result:
            user_ref = db.collection('users').document(user_id)
            user_ref.update({'cryDetected': True})
            Timer(600, reset_detection, args=(user_id,)).start()

        return jsonify({'status': 'success', 'userId': user_id, 'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        for f in [input_path, boosted_path]:
            if os.path.exists(f):
                os.remove(f)

def predict_audio(filepath, classifier):
    try:
        print(f"🔍 Analyzing: {os.path.basename(filepath)}")

        # 1. Load audio
        audio, _ = librosa.load(filepath, sr=sample_rate)

        # 2. Extract Wav2Vec embedding
        inputs = processor(audio, return_tensors="pt", sampling_rate=sample_rate, padding=True).to(device)
        with torch.no_grad():
            embedding = model(**inputs).last_hidden_state.mean(dim=1).cpu().numpy()

        # 3. Predict
        prediction = classifier.predict(embedding)[0]
        is_cry = bool(prediction == 1)
        print(f"✅ Prediction: {'CRY' if is_cry else 'NO_CRY'}")

        return is_cry

    except Exception as e:
        print(f"❌ Error: {e}")
        return None


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
