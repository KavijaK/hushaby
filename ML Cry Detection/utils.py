import os
from flask import request

# Create a folder if it doesn’t exist
def ensure_folder_exists(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

# Save uploaded audio file to disk
def save_audio(file_storage, filename, upload_folder='received_audio'):
    ensure_folder_exists(upload_folder)
    file_path = os.path.join(upload_folder, filename)
    file_storage.save(file_path)
    return file_path
