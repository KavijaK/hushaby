import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase app and return Firestore client
def init_firestore():
    cred = credentials.Certificate("hushaby-9524d-firebase-adminsdk-fbsvc-270d56f750.json")
    firebase_admin.initialize_app(cred)
    return firestore.client()