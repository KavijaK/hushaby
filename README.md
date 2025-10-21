# Hushaby - Smart Baby Cradle

Hushaby is an IoT-enabled, intelligent baby cradle designed to provide automated comfort and peace of mind for both parents and infants. Leveraging sound detection, environmental sensors, and machine learning, Hushaby can detect a baby’s cries, adjust the cradle’s rocking mechanism, and activate soothing sounds—all while offering remote control via a mobile app.

## Key Features

- **Automatic Cry Detection & Soothing:** 
  - Utilizes a **GY-MAX4466 sound sensor** and **INMP441 microphone** to detect and classify baby cries.
  - Implements an AI-based model to trigger rocking and music, offering real-time comfort for the infant.
  
- **Environmental Monitoring:** 
  - Monitors room temperature using a **DHT11 sensor** and activates a **cooling fan** when necessary.
  - **Raindrop moisture sensors** alert parents to wetness in the cradle, triggering timely interventions.

- **Mobile App Integration:** 
  - A React Native app provides remote monitoring and control of the cradle, including the fan, rocker, and lullaby settings.

- **Low Power Consumption:** 
  - Powered by a **12V supply**, regulated to **5V** and **3.3V**, ensuring reliable 24/7 operation.

- **Custom Hardware Design:** 
  - A custom **ESP32-WROOM module** on a PCB board integrates sensors and actuators, while the cradle structure is made from durable wooden frames and cushioned fabric.

## Architecture

### Hardware Components

- **Microcontroller:** ESP32-WROOM
- **Sensors:** DHT11 (Temperature), GY-MAX4466 (Sound), INMP441 (Audio), Raindrop (Moisture)
- **Actuators:** DC Motor (Rocking Mechanism), DFPlayer Mini (Audio Playback), Cooling Fan
- **Connectivity:** Wi-Fi (Firebase, MQTT)

### Software Components

- **Machine Learning Model:** Cry detection using a lightweight ensemble of **XGBoost** and **SVM** classifiers (94.5% accuracy).
- **Mobile App:** Developed in **React Native** for real-time control and monitoring.

### Power Supply

- Input: **230V AC**, converted to **12V DC** via custom PCB for regulated output to components.

## Build Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KavijaK/hushaby.git
Hardware Setup:

Assemble the cradle frame with the wooden and metal components.

Connect the ESP32, sensors, and actuators to the PCB as per the schematic.

Software Setup:

Upload the firmware to the ESP32 via Arduino IDE.

Set up the Firebase project for cloud data storage and monitoring.

Mobile App:

Install dependencies:

bash
Copy code
npm install
Configure Firebase integration in the app.

Run the app using:

bash
Copy code
react-native run-android
Future Enhancements
Advanced Machine Learning: Improved cry detection with more accurate models trained on diverse datasets.

Mobile App Enhancements: Add sleep trend analytics, secure video streaming, and voice assistant compatibility.

Smart Home Integration: Seamless control with smart home devices like Google Assistant and Alexa.

Images



pgsql
Copy code

You can copy and paste this markdown code into your `README.md` file. Make sure to replace the image paths (`./assets/cradle.png`, etc.) with the correct paths based on where your images are located in the repository.






You said:
You have half as markdown the rest in normal text lol


ChatGPT said:
Apologies for the confusion! Here's the corrected version with everything properly formatted in markdown:

markdown
Copy code
# Hushaby - Smart Baby Cradle

Hushaby is an IoT-enabled, intelligent baby cradle designed to provide automated comfort and peace of mind for both parents and infants. Leveraging sound detection, environmental sensors, and machine learning, Hushaby can detect a baby’s cries, adjust the cradle’s rocking mechanism, and activate soothing sounds—all while offering remote control via a mobile app.

## Key Features

- **Automatic Cry Detection & Soothing:**  
  Utilizes a **GY-MAX4466 sound sensor** and **INMP441 microphone** to detect and classify baby cries.  
  Implements an AI-based model to trigger rocking and music, offering real-time comfort for the infant.
  
- **Environmental Monitoring:**  
  Monitors room temperature using a **DHT11 sensor** and activates a **cooling fan** when necessary.  
  **Raindrop moisture sensors** alert parents to wetness in the cradle, triggering timely interventions.

- **Mobile App Integration:**  
  A React Native app provides remote monitoring and control of the cradle, including the fan, rocker, and lullaby settings.

- **Low Power Consumption:**  
  Powered by a **12V supply**, regulated to **5V** and **3.3V**, ensuring reliable 24/7 operation.

- **Custom Hardware Design:**  
  A custom **ESP32-WROOM module** on a PCB board integrates sensors and actuators, while the cradle structure is made from durable wooden frames and cushioned fabric.

## Architecture

### Hardware Components

- **Microcontroller:** ESP32-WROOM
- **Sensors:** DHT11 (Temperature), GY-MAX4466 (Sound), INMP441 (Audio), Raindrop (Moisture)
- **Actuators:** DC Motor (Rocking Mechanism), DFPlayer Mini (Audio Playback), Cooling Fan
- **Connectivity:** Wi-Fi (Firebase, MQTT)

### Software Components

- **Machine Learning Model:** Cry detection using a lightweight ensemble of **XGBoost** and **SVM** classifiers (94.5% accuracy).
- **Mobile App:** Developed in **React Native** for real-time control and monitoring.

### Power Supply

- Input: **230V AC**, converted to **12V DC** via custom PCB for regulated output to components.

## Build Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KavijaK/hushaby.git
