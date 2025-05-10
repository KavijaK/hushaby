import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase app and return Firestore client
def init_firestore():
    cred = credentials.Certificate("your-service-account.json")
    firebase_admin.initialize_app(cred)
    return firestore.client()