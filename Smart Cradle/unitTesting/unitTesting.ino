#include "motorTest.h"
#include "dFPlayer.h"
#include "dFPlayer.h"
#include "wetnessSensor.h"
#include "soundSensor.h"
#include "DHTSensor.h"

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  initMotor();
  initDFPlayer();
  initWetnessSensor();
  initSoundSensor();
  initDHTSensor();
}

void loop() {
  // put your main code here, to run repeatedly:

}
