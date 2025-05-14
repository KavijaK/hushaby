#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

const char* ssid = "Galaxy M2118AB";
const char* password = "uwil7317";

const char* uid = "VGnkFDQOKPOMf5Gr8UPp6tII1yi2";

// MQTT broker details private
const char* mqtt_broker = "f2ebba36fe344449a374fbff41eba187.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "hushaby";
const char* mqtt_password = "Hushhush2023";

// Create instances
WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println("\n-------------------");
}

void setupMQTT() {
  mqttClient.setServer(mqtt_broker, mqtt_port);
  mqttClient.setCallback(callback);
}

void reconnect() {
  Serial.println("Connecting to MQTT Broker...");
  while (!mqttClient.connected()) {
    Serial.println("Reconnecting to MQTT Broker...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    if (mqttClient.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Connected to MQTT Broker.");
      // Subscribe to Firebase MQTT topics
      String fanTopic = "cradle/" + String(uid) + "/fan";
      String rockerTopic = "cradle/" + String(uid) + "/rocker";
      String musicTopic = "cradle/" + String(uid) + "/music";

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

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Connected to Wi-Fi");

  // Initialize secure WiFiClient
  wifiClient.setInsecure(); // Use this only for testing, it allows connecting without a root certificate
  
  setupMQTT();
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();
}





      