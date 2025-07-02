#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "env.h"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Firebase token status callback
void tokenStatusCallback(TokenInfo info) {
  Serial.print("Firebase token status: ");
  Serial.println(info.status == token_status_ready ? "Ready" : "Not Ready");
}

void setupWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected!");
}

void updateDiaperWetness(int wetness) {
  String docPath = "users/" + String(USER_UID);

  FirebaseJson content;
  content.set("fields/diaperWetness/integerValue", String(wetness));

  Serial.println("📤 Updating diaperWetness...");
  if (Firebase.Firestore.updateDocument(&fbdo, PROJECT_ID, "", docPath.c_str(), content.raw(), "")) {
    Serial.println("✅ diaperWetness updated successfully.");
  } else {
    Serial.println("❌ Failed to update diaperWetness: " + fbdo.errorReason());
  }
}


void connectToFirebase() {
  config.api_key = API_KEY;
  config.token_status_callback = tokenStatusCallback;

  // Anonymous sign-in
  auth.user.email = "karunarathnakavija@gmail.com";
  auth.user.password = "kavija123";

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("⏳ Connecting to Firebase...");
  while (auth.token.uid == "") {
    delay(300);
  }
  Serial.println("✅ Firebase initialized");
}

void updateUserCradleData(bool fanStatus, int fanSpeed, int wetness) {
  String docPath = "users/" + String(USER_UID);

  FirebaseJson content;
  content.set("fields/cradleFanOn/booleanValue", fanStatus);
  content.set("fields/cradleFanSpeed/integerValue", String(fanSpeed));
  content.set("fields/diaperWetness/integerValue", String(wetness));

  Serial.println("📤 Sending to Firestore (update)...");
  if (Firebase.Firestore.updateDocument(&fbdo, PROJECT_ID, "", docPath.c_str(), content.raw(), "")) {
    Serial.println("✅ Firestore updated successfully.");
  } else {
    Serial.println("❌ Firestore update failed: " + fbdo.errorReason());
  }
void setup() {
  Serial.begin(9600);
  setupWiFi();              // ✅ FIXED: Correct function name
  connectToFirebase();

  delay(3000); // Give time for Firebase to fully initialize

  // Example sensor values
  bool cradleFanOn = true;
  int cradleFanSpeed = 2;
  int diaperWetness = 76;

  updateUserCradleData(cradleFanOn, cradleFanSpeed, diaperWetness);
}

void loop() {
  // Refresh sensor readings and call updateUserCradleData here
  delay(10000);
}
