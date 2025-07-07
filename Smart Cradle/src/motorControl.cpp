#include "motorControl.h"
#include <Arduino.h>

void setupMotors() {
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(PWMA, OUTPUT);

  pinMode(BIN1, OUTPUT);
  pinMode(BIN2, OUTPUT);
  pinMode(PWMB, OUTPUT);
}

void runCradleFan() {
  digitalWrite(BIN1, HIGH);  // Direction (adjust if needed)
  digitalWrite(BIN2, LOW);
  analogWrite(PWMB, 255);
}

void runRockerMotor() {
  unsigned long startTime = millis();
  const unsigned long duration = 15000; // 15 seconds

  while (millis() - startTime < duration) {
    setMotor(1, 125);   // Clockwise
    delay(1000);
    setMotor(-1, 125);  // Counterclockwise
    delay(1000);
  }
  // Stop the motor after 15 seconds
  stopRockerMotor();
}

void stopCradleFan() {
  digitalWrite(BIN1, LOW);
  digitalWrite(BIN2, LOW);
  analogWrite(PWMB, 0); // Stops the PWM signal
}

void stopRockerMotor() {
  digitalWrite(AIN1, LOW);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 0); // Stops the PWM signal
}

void setMotor(int dir, int pwmVal) {
  pwmVal = constrain(pwmVal, 0, 255);
  analogWrite(PWMA, pwmVal);

  if (dir == 1) {
    digitalWrite(AIN1, HIGH);
    digitalWrite(AIN2, LOW);
  } else if (dir == -1) {
    digitalWrite(AIN1, LOW);
    digitalWrite(AIN2, HIGH);
  } else {
    digitalWrite(AIN1, LOW);
    digitalWrite(AIN2, LOW);
  }
}
