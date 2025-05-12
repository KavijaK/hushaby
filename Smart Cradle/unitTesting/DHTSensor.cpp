#include "DHTSensor.h"
#include <DHT.h>

#define DHTPIN 27
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void initDHTSensor() {
    dht.begin();
}

void printDHTReadings() {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    Serial.print("Temp: ");
    Serial.print(temp);
    Serial.print(" °C\tHumidity: ");
    Serial.print(hum);
    Serial.println(" %");
}
