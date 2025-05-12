#include "dFPlayer.h"
#include <DFRobotDFPlayerMini.h>
#include <HardwareSerial.h>

// UART1: TX=17, RX=16 (change as needed)
HardwareSerial mySerial(1);
DFRobotDFPlayerMini myDFPlayer;

void initDFPlayer() {
    mySerial.begin(9600, SERIAL_8N1, 16, 17); // RX, TX

    if (!myDFPlayer.begin(mySerial)) {
        Serial.println("DFPlayer Mini not detected!");
        while (true);
    }
    Serial.println("DFPlayer Mini online.");
    myDFPlayer.volume(20);  // Set volume (0-30)
}

void playDFPlayerTrack(int trackNumber, int playDurationMs) {
    myDFPlayer.play(trackNumber);
    delay(playDurationMs);
    myDFPlayer.stop();
}

void stopDFPlayer() {
    myDFPlayer.stop();
}
