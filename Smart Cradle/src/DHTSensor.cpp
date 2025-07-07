#include "DHTSensor.h"
#include <DHT.h>

DHT dht(DHTPIN, DHTTYPE);

void initDHTSensor() {
    dht.begin();
}

void printDHTReadings() {
    float temp = dht.readTemperature();
    Serial.print("Temp: ");
    Serial.print(temp);
}

float getTemperature() {
  return dht.readTemperature();
}
