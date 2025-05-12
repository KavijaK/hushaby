const int soundPin = 34;   // Analog pin for sound sensor
const int threshold = 3000; // Adjust based on noise level
const int windowMs = 100;   // Sampling window
const int sustainTime = 5000; // 5 seconds sustain
unsigned long aboveThresholdDuration = 0;
unsigned long lastCheckTime = 0;

void loop() {
  if (millis() - lastCheckTime >= windowMs) {
    lastCheckTime = millis();

    int value = analogRead(soundPin);
    
    if (value > threshold) {
      aboveThresholdDuration += windowMs;
    } else {
      aboveThresholdDuration = 0; // Reset if sound drops
    }

    // Trigger recording if sound sustained long enough
    if (aboveThresholdDuration >= sustainTime) {
      recordAndSendAudio(); // Call I2S + HTTP upload
      aboveThresholdDuration = 0; // Reset to avoid immediate re-trigger
    }
  }
}
