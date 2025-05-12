#include "WetnessSensor.h"

void initWetnessSensor() {
    pinMode(WETNESS_PIN, INPUT);
}

void printWetnessReading() {
    int wetnessValue = analogRead(WETNESS_PIN); // 0 (wet) to 4095 (dry) on ESP32
    Serial.print("Wetness sensor value: ");
    Serial.println(wetnessValue);
}
