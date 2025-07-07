#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

// Pin configuration — modify as needed
#define AIN1 16  
#define AIN2 17  
#define PWMA 18

#define BIN1 19
#define BIN2 21
#define PWMB 22

#define STBY 23

#define ROCKER_MOTOR_SPEED 180

// Function declarations
void setupMotors();

void runCradleFan(int pwmSpeed);
void stopCradleFan();

void runRockerMotor();
void stopRockerMotor();

void stopAllMotors();

#endif
