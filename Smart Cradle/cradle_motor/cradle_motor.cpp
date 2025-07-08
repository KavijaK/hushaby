// Motor control pins
#define PWM 13
#define IN1 12
#define IN2 14

void setup() {
  pinMode(PWM, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.print("Running motor at PWM speed: ");
  Serial.println(130);
  setMotor(1, 125);  // Clockwise at increasing speeds
  delay(1000);

  Serial.print("Running motor at PWM speed: ");
  Serial.println(130);
  setMotor(-1, 125);  // Clockwise at increasing speeds
  delay(1000);
  

  // Serial.println("Stopping motor");
  // setMotor(0, 0);  // Stop
  // delay(1000);
}

// Motor control function
void setMotor(int dir, int pwmVal) {
  pwmVal = constrain(pwmVal, 0, 255);
  analogWrite(PWM, pwmVal);

  if (dir == 1) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
  } else if (dir == -1) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
  } else {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
  }
}
