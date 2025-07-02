const int analogPin = A0;      // KY-037 analog pin
const int soundThreshold = 600; // Set your sound intensity threshold here
const int triggerCount = 10;    // Number of consecutive readings above threshold to trigger
const int sampleInterval = 50;  // Delay between samples in milliseconds

int aboveThresholdCount = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int analogValue = analogRead(analogPin);

  Serial.print("Analog Value: ");
  Serial.println(analogValue);

  if (analogValue > soundThreshold) {
    aboveThresholdCount++;
  } else {
    aboveThresholdCount = 0; // reset if noise drops
  }

  // If loud sound persists for enough readings
  if (aboveThresholdCount >= triggerCount) {
    Serial.println("🎙️ Start recording... Loud sound detected!");
    // You can trigger any function here (e.g., start audio recording)
    
    // Reset counter so it triggers only once per event
    aboveThresholdCount = 0;
  }

  delay(sampleInterval);
}
