#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Firebase_ESP_Client.h>
#include "env.h"
#include "motorControl.h"
#include "wetnessSensors.h"
#include "DFRobotDFPlayerMini.h"

#define FPSerial Serial2

// Create an instance of the DFPlayer Mini
DFRobotDFPlayerMini myDFPlayer;

//// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Wifi instances
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

bool isWet = false;

/////////////////////////// DF Player ///////////////////////////////////////


void setupDFPlayer() {
  FPSerial.begin(9600, SERIAL_8N1, 16, 17);  // Define Serial2 with specific pins
  Serial.println(F("DFRobot DFPlayer Mini Demo"));
  Serial.println(F("Initializing DFPlayer ... (May take 3~5 seconds)"));

  if (!myDFPlayer.begin(FPSerial)) {
    Serial.println(F("Unable to begin:"));
    Serial.println(F("1. Please recheck the connection!"));
    Serial.println(F("2. Please insert the SD card!"));
    while (true) {
      delay(0); // Code to compatible with ESP8266 watch dog.
    }
  }
  Serial.println(F("DFPlayer Mini online."));
  myDFPlayer.volume(30);
}

//////////////////////////// END OF DF Player ///////////////////////////////

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
      runCradleFan(); // Example PWM speed for ON
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
    if (message == "1" || message == "2" || message == "3") {
      String msgStr = String(message); 
      myDFPlayer.play(msgStr.toInt());
    } else {
      myDFPlayer.stop();
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

void updateDiaperWetness() {
  String docPath = "users/" + String(USER_UID);

  FirebaseJson content;
  content.set("fields/diaperWetness/integerValue", "80");  // Set as integer

  Serial.println("📤 Updating diaperWetness...");
  if (Firebase.Firestore.patchDocument(&fbdo, PROJECT_ID, "", docPath.c_str(), content.raw(), "diaperWetness")) {
    Serial.println("✅ diaperWetness updated successfully.");
  } else {
    Serial.println("❌ Failed to update diaperWetness: " + fbdo.errorReason());
  }
}


/////////////////////////////// END OF FIREBASE /////////////////////////////////////

////////////////////////////// START OF WETNESSS ///////////////////////////////////

void runWetness() {
  bool isWet = checkWetness();
  if (isWet ==  true) {
    updateDiaperWetness();
  }
}

//////////////////////////////// END OF WETNESS ////////////////////////////////////

void setup() {
  Serial.begin(9600);
  setupWiFi();
  setupMQTT();  
  setupWetnessSensor();  
  delay(2500);  
  connectToFirebase();
  delay(3000);     
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();
  runWetness();
}
