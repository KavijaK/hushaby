import os
import pandas as pd
import numpy as np
import librosa
import torch
from tqdm import tqdm
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import xgboost as xgb
from transformers import Wav2Vec2Processor, Wav2Vec2Model

# ==== CONFIG ====
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model_name = "facebook/wav2vec2-base"
sample_rate = 16000

base_audio_dir = r"D:\Crying\new\Actual\audio"
train_csv = r"D:\Crying\new\actual\audio\TRAIN\train_merged_shuffled.csv"
test_csv = r"D:\Crying\new\actual\audio\TEST\test_merged_shuffled.csv"

# ==== Load Wav2Vec2 ====
processor = Wav2Vec2Processor.from_pretrained(model_name)
model = Wav2Vec2Model.from_pretrained(model_name).to(device).eval()

# ==== Feature extractor ====
def extract_wav2vec_embedding(file_path):
    try:
        y, _ = librosa.load(file_path, sr=sample_rate)
        inputs = processor(y, return_tensors="pt", sampling_rate=sample_rate, padding=True).to(device)
        with torch.no_grad():
            emb = model(**inputs).last_hidden_state
        return emb.mean(dim=1).cpu().numpy().squeeze()
    except Exception as e:
        print(f"⚠️ Error processing {file_path}: {e}")
        return None

# ==== Load and process dataset ====
def load_embeddings_from_csv(csv_path, subset="TRAIN"):
    df = pd.read_csv(csv_path)
    X, y = [], []
    for _, row in tqdm(df.iterrows(), total=len(df)):
        filename = row['slice_file_name']
        label_str = row['class']
        label = 1 if label_str == 'baby_cry' else 0
        fold = "fold1" if label_str == 'baby_cry' else "fold0"
        full_path = os.path.join(base_audio_dir, subset, fold, filename)

        feat = extract_wav2vec_embedding(full_path)
        if feat is not None:
            X.append(feat)
            y.append(label)
    return np.array(X), np.array(y)

# ==== Load training and test sets ====
print("🎧 Loading training data...")
X_train, y_train = load_embeddings_from_csv(train_csv, subset="TRAIN")

print("🎧 Loading test data...")
X_test, y_test = load_embeddings_from_csv(test_csv, subset="TEST")



import joblib  # Add this at the top

# ==== Train SVM ====
print("🤖 Training SVM...")
svm_clf = SVC(kernel='rbf', class_weight='balanced', probability=True)
svm_clf.fit(X_train, y_train)
y_pred_svm = svm_clf.predict(X_test)

print("📊 SVM Results:")
print(classification_report(y_test, y_pred_svm, target_names=["no_cry", "baby_cry"]))

# ✅ Save SVM model
joblib.dump(svm_clf, "svm_baby_cry_model.joblib")
print("💾 SVM model saved to svm_baby_cry_model.joblib")

# ==== Train XGBoost ====
print("🌲 Training XGBoost...")
pos_weight = len(y_train[y_train == 0]) / len(y_train[y_train == 1])
xgb_clf = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.05,
    scale_pos_weight=pos_weight,
    use_label_encoder=False,
    eval_metric='logloss'
)
xgb_clf.fit(X_train, y_train)
y_pred_xgb = xgb_clf.predict(X_test)

print("📊 XGBoost Results:")
print(classification_report(y_test, y_pred_xgb, target_names=["no_cry", "baby_cry"]))

# ✅ Save XGBoost model
joblib.dump(xgb_clf, "xgb_baby_cry_model.joblib")
print("💾 XGBoost model saved to xgb_baby_cry_model.joblib")


