#include <WiFi.h>
#include <HTTPClient.h>
#include "SPIFFS.h"
#include "driver/i2s.h"

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Flask server
const char* serverUrl = "http://<your-server-ip>:5000/upload";
const char* userId = "user_123"; // dynamically assign if needed

// I2S pins (INMP441)
#define I2S_WS  15
#define I2S_SD  32
#define I2S_SCK 14

#define SAMPLE_RATE     16000
#define RECORD_SECONDS  10
#define BUFFER_SIZE     1024

// Sound sensor (analog)
const int soundPin = 34;
const int threshold = 3000;           // tune based on your sensor
const int windowMs = 100;
const int sustainTimeMs = 5000;       // 5 seconds

unsigned long aboveThresholdDuration = 0;
unsigned long lastCheckTime = 0;

// Setup I2S
void setupI2S() {
  const i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = 1024,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
  };

  const i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_SCK,
    .ws_io_num = I2S_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = I2S_SD
  };

  i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pin_config);
  i2s_zero_dma_buffer(I2S_NUM_0);
}

// Record audio from I2S
void recordAudio(const char* filename) {
  File file = SPIFFS.open(filename, FILE_WRITE);
  if (!file) {
    Serial.println("[ERROR] Failed to open file for writing");
    return;
  }

  int16_t buffer[BUFFER_SIZE];
  size_t bytesRead;
  int totalBytes = SAMPLE_RATE * RECORD_SECONDS * sizeof(int16_t);

  Serial.println("[INFO] Recording audio...");
  for (int i = 0; i < totalBytes / sizeof(buffer); i++) {
    i2s_read(I2S_NUM_0, &buffer, sizeof(buffer), &bytesRead, portMAX_DELAY);
    file.write((uint8_t*)buffer, bytesRead);
  }

  file.close();
  Serial.println("[INFO] Recording complete");
}

// Send audio to Flask server
void sendAudio(const char* filename) {
  File file = SPIFFS.open(filename);
  if (!file) {
    Serial.println("[ERROR] Cannot open file to send");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);

  String boundary = "----boundary";
  String contentType = "multipart/form-data; boundary=" + boundary;
  http.addHeader("Content-Type", contentType);

  // Build body
  WiFiClient *stream = http.getStreamPtr();
  String start = "--" + boundary + "\r\n";
  start += "Content-Disposition: form-data; name=\"file\"; filename=\"audio.pcm\"\r\n";
  start += "Content-Type: application/octet-stream\r\n\r\n";
  stream->print(start);

  while (file.available()) {
    stream->write(file.read());
  }

  file.close();

  String middle = "\r\n--" + boundary + "\r\n";
  middle += "Content-Disposition: form-data; name=\"userId\"\r\n\r\n";
  middle += userId;
  middle += "\r\n--" + boundary + "--\r\n";
  stream->print(middle);

  int code = http.POST("");
  Serial.printf("[HTTP] Response code: %d\n", code);
  Serial.println(http.getString());

  http.end();
}

// Main handler
void recordAndSendAudio() {
  recordAudio("/audio.pcm");
  sendAudio("/audio.pcm");
}

// Setup
void setup() {
  Serial.begin(115200);
  SPIFFS.begin(true);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\n[INFO] WiFi Connected");

  setupI2S();
}

// Loop monitors for sustained sound
void loop() {
  if (millis() - lastCheckTime >= windowMs) {
    lastCheckTime = millis();

    int value = analogRead(soundPin);
    Serial.println(value);

    if (value > threshold) {
      aboveThresholdDuration += windowMs;
    } else {
      aboveThresholdDuration = 0;
    }

    if (aboveThresholdDuration >= sustainTimeMs) {
      Serial.println("[TRIGGER] Sustained sound detected");
      recordAndSendAudio();
      aboveThresholdDuration = 0;
    }
  }
}
