#include "wetnessSensors.h"
#include <Arduino.h>

void setupWetnessSensor() {
  pinMode(LEFTWET, INPUT);
  pinMode(MIDWET, INPUT);
  pinMode(RIGHTWET, INPUT);
}

bool checkWetness() {
  int leftVal = analogRead(LEFTWET);
  int midVal = analogRead(MIDWET);
  int rightVal = analogRead(RIGHTWET);
  if ((leftVal < LEFTTH || rightVal < RIGHTTH || midVal < MIDTH) && !isWet) {
    isWet = true;
    return true;
  }
  if ((leftVal > LEFTTH && rightVal > RIGHTTH && midVal > MIDTH) && isWet) {
    isWet = false;
    return false;
  }
  return false;
}
