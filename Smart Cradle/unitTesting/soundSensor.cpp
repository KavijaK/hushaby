#include "SoundSensor.h"

#define SOUND_PIN 35   // Change as needed

void initSoundSensor() {
    pinMode(SOUND_PIN, INPUT);
}

void printSoundLevel() {
    int soundValue = analogRead(SOUND_PIN); // 0 to 4095
    Serial.print("Sound level: ");
    Serial.println(soundValue);
}
