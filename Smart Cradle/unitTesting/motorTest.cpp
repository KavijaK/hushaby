#include "motorTest.h"
#include "<Arduino.h>"

void initMotors() {
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void runMotor(int speed) {
  // Run the motors for 5 seconds
  analogWrite(PWM, speed);
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  Serial.println("Motor Forward");
  delay(5000);

  // Stop the motors
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);  
}