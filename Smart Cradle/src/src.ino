#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Firebase_ESP_Client.h>
#include "env.h"
#include "motorControl.h"

//// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Wifi instances
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

///////////////////////////// MQTT BROKER ///////////////////////////////////

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  Serial.println(message);
  Serial.println("-------------------");

  if (String(topic).endsWith("/cradleFan")) {
    if (message == "on") {
      runCradleFan(200); // Example PWM speed for ON
    } else if (message == "off") {
      stopCradleFan();
    }
  }

  else if (String(topic).endsWith("/autoRocker")) {
    if (message == "on") {
      runRockerMotor();
    } else if (message == "off") {
      stopRockerMotor();
    }
  }

  else if (String(topic).endsWith("/music")) {
    if (message == "on") {
      // TODO: implement music playback
    } else if (message == "off") {
      // TODO: implement music stop
    }
  }
}


void setupMQTT() {
  mqttClient.setServer(MQTT_BROKER, 8883);
  mqttClient.setCallback(callback);
}

void reconnect() {
  Serial.println("Connecting to MQTT Broker...");
  while (!mqttClient.connected()) {
    Serial.println("Reconnecting to MQTT Broker...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (mqttClient.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASS)) {
      Serial.println("Connected to MQTT Broker.");
      // Subscribe to Firebase MQTT topics
      String fanTopic = "cradle/" + String(USER_UID) + "/fan";
      String rockerTopic = "cradle/" + String(USER_UID) + "/rocker";
      String musicTopic = "cradle/" + String(USER_UID) + "/music";

      mqttClient.subscribe(fanTopic.c_str());
      mqttClient.subscribe(rockerTopic.c_str());
      mqttClient.subscribe(musicTopic.c_str());
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

/////////////////// END OF MQTT BROKER /////////////////////////////////



//////////////////// FIREBASE RELATED //////////////////////////////////
void tokenStatusCallback(TokenInfo info) {
  Serial.print("Firebase token status: ");
  Serial.println(info.status == token_status_ready ? "Ready" : "Not Ready");
}

void setupWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  // Initialize secure WiFiClient
  wifiClient.setInsecure(); // Use this only for testing, it allows connecting without a root certificate
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" connected!");
}

void connectToFirebase() {
  config.api_key = API_KEY;
  config.token_status_callback = tokenStatusCallback;

  // Anonymous sign-in
  auth.user.email = EMAIL;
  auth.user.password = PASS;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println(" Connecting to Firebase...");
  while (auth.token.uid == "") {
    delay(300);
  }
  Serial.println(" Firebase initialized");
}

void updateCradleFanStatus(bool fanStatus) {
  String docPath = "users/" + String(USER_UID);

  FirebaseJson content;
  content.set("fields/cradleFanOn/booleanValue", fanStatus);

  Serial.println("📤 Updating cradleFanOn...");
  if (Firebase.Firestore.patchDocument(&fbdo, PROJECT_ID, "", docPath.c_str(), content.raw(), "cradleFanOn")) {
    Serial.println("✅ cradleFanOn updated successfully.");
  } else {
    Serial.println("❌ Failed to update cradleFanOn: " + fbdo.errorReason());
  }
}


void updateCradleFanSpeed(int fanSpeed) {
  String docPath = "users/" + String(USER_UID);

  FirebaseJson content;
  content.set("fields/cradleFanSpeed/integerValue", String(fanSpeed));

  Serial.println("📤 Updating cradleFanSpeed...");
  if (Firebase.Firestore.patchDocument(&fbdo, PROJECT_ID, "", docPath.c_str(), content.raw(), "cradleFanSpeed")) {
    Serial.println("✅ cradleFanSpeed updated successfully.");
  } else {
    Serial.println("❌ Failed to update cradleFanSpeed: " + fbdo.errorReason());
  }
}

void updateRoomTemperature(float temperature) {
  String docPath = "users/" + String(USER_UID);

  FirebaseJson content;
  content.set("fields/roomTemperature/doubleValue", String(temperature, 2));

  Serial.println("📤 Updating roomTemperature...");
  if (Firebase.Firestore.patchDocument(&fbdo, PROJECT_ID, "", docPath.c_str(), content.raw(), "roomTemperature")) {
    Serial.println("✅ roomTemperature updated successfully.");
  } else {
    Serial.println("❌ Failed to update roomTemperature: " + fbdo.errorReason());
  }
}


/////////////////////////////// END OF FIREBASE /////////////////////////////////////

void setup() {
  Serial.begin(9600);
  setupWiFi();
  setupMQTT();    
  delay(2500);
  // setupMotors();   
  // Serial.println("Motors done");      
  connectToFirebase();
  delay(3000);     
  // Give time for Firebase to fully initialize
  updateRoomTemperature(55);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();
}
