#include "motorControl.h"
#include <Arduino.h>

void setupMotors() {
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(PWMA, OUTPUT);

  pinMode(BIN1, OUTPUT);
  pinMode(BIN2, OUTPUT);
  pinMode(PWMB, OUTPUT);

  pinMode(STBY, OUTPUT);
  digitalWrite(STBY, HIGH);  // Enable motor driver
}

void runCradleFan(int pwmSpeed) {
  pwmSpeed = constrain(pwmSpeed, 0, 255); // Ensure valid range

  digitalWrite(AIN1, HIGH);  // Direction (adjust if needed)
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, pwmSpeed);
}

void runRockerMotor() {
  digitalWrite(BIN1, HIGH);  // Direction (adjust if needed)
  digitalWrite(BIN2, LOW);
  analogWrite(PWMB, ROCKER_MOTOR_SPEED);
}

void stopCradleFan() {
  digitalWrite(AIN1, LOW);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 0); // Stops the PWM signal
}

void stopRockerMotor() {
  digitalWrite(BIN1, LOW);
  digitalWrite(BIN2, LOW);
  analogWrite(PWMB, 0); // Stops the PWM signal
}
