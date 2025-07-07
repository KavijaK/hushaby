#ifndef MOTOR_CONTROL_H
#define MOTOR_CONTROL_H

// Pin configuration — modify as needed
#define AIN1 16  
#define AIN1 23 
#define AIN2 27
#define PWMA 18

#define BIN1 19
#define BIN2 21
#define PWMB 5

// Function declarations
void setupMotors();

void runCradleFan();
void stopCradleFan();

void runRockerMotor();
void stopRockerMotor();

void setMotor(int dir, int pwmVal);

#endif
