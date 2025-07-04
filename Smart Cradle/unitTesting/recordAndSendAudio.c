#include <WiFi.h>
#include <HTTPClient.h>
#include <driver/i2s.h>

// WiFi Config
const char* ssid = "YourSSID";
const char* password = "YourPassword";
const char* serverUrl = "http://your-flask-server.com/upload_raw";  // Flask server URL
const char* userId = "esp_user_123";  // Optional: can be set per device

// I2S Pins
#define I2S_SCK 26
#define I2S_WS  25
#define I2S_SD  22

// I2S config
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 8000
#define BUFFER_SIZE 512  // 512 samples = 1024 bytes (16-bit mono)

void setup() {
  Serial.begin(115200);

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("[INFO] Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[INFO] WiFi connected!");

  // I2S config
  const i2s_config_t i2s_config = {
    .mode = i2s_mode_t(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = 0,
    .dma_buf_count = 8,
    .dma_buf_len = 512,
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

  i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pin_config);
}

void loop() {
  Serial.println("[INFO] Recording and uploading 8 seconds of audio...");

  const int duration_sec = 8;
  const int total_samples = SAMPLE_RATE * duration_sec;
  const int total_bytes = total_samples * 2; // 16-bit mono
  int16_t* audio_data = (int16_t*)malloc(total_bytes);

  if (!audio_data) {
    Serial.println("[ERROR] Not enough RAM for audio buffer!");
    delay(10000);
    return;
  }

  size_t bytesRead = 0;
  size_t offset = 0;
  size_t to_read = BUFFER_SIZE * sizeof(int16_t);

  // Read audio data into buffer
  while (offset < total_bytes) {
    size_t bytes_to_read = min(to_read, total_bytes - offset);
    size_t chunk_bytes = 0;
    esp_err_t res = i2s_read(I2S_PORT, (uint8_t*)audio_data + offset, bytes_to_read, &chunk_bytes, portMAX_DELAY);
    if (res != ESP_OK) {
      Serial.printf("[ERROR] I2S read failed: %d\n", res);
      free(audio_data);
      delay(10000);
      return;
    }
    offset += chunk_bytes;
  }

  // Prepare HTTP POST
  HTTPClient http;
  String full_url = String(serverUrl) + "?userId=" + userId;
  http.begin(full_url);
  http.addHeader("Content-Type", "application/octet-stream");

  int response = http.POST((uint8_t*)audio_data, total_bytes);
  Serial.printf("[INFO] Upload complete. Server responded with: %d\n", response);

  if (response > 0) {
    String payload = http.getString();
    Serial.println("[INFO] Server response:");
    Serial.println(payload);
  } else {
    Serial.printf("[ERROR] HTTP POST failed: %s\n", http.errorToString(response).c_str());
  }

  http.end();
  free(audio_data);

  delay(10000);  // Wait before next upload (adjust as needed)
}
