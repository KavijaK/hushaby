const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mqtt = require("mqtt");

admin.initializeApp();

function getMQTTClient() {
  return mqtt.connect("mqtts://f2ebba36fe344449a374fbff41eba187.s1.eu.hivemq.cloud:8883", {
    username: "hushaby",
    password: "Hushhush2023",
  });
}

exports.onCradleFanChange = onDocumentUpdated(
  {
    document: "users/{uid}",
    region: "asia-south2"
  },
  async (event) => {
    const uid = event.params.uid;
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (!before || !after) return;

    if (after.cradleFanOn !== before.cradleFanOn) {
      const client = getMQTTClient();
      const message = after.cradleFanOn ? "on" : "off";

      return new Promise((resolve, reject) => {
        client.on("connect", () => {
          client.publish(`cradle/${uid}/fan`, message, {}, (err) => {
            client.end();
            err ? reject(err) : resolve();
          });
        });
        client.on("error", (err) => {
          client.end();
          reject(err);
        });
      });
    }
  }
);

// Do the same for other functions 👇

exports.onAutoRockerChange = onDocumentUpdated(
  {
    document: "users/{uid}",
    region: "asia-south2"
  },
  async (event) => {
    const uid = event.params.uid;
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (!before || !after) return;

    if (after.autoRockerOn !== before.autoRockerOn) {
      const client = getMQTTClient();
      const message = after.autoRockerOn ? "on" : "off";

      return new Promise((resolve, reject) => {
        client.on("connect", () => {
          client.publish(`cradle/${uid}/rocker`, message, {}, (err) => {
            client.end();
            err ? reject(err) : resolve();
          });
        });
        client.on("error", (err) => {
          client.end();
          reject(err);
        });
      });
    }
  }
);

exports.onMusicChange = onDocumentUpdated(
  {
    document: "users/{uid}",
    region: "asia-south2"
  },
  async (event) => {
    const uid = event.params.uid;
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (!before || !after) return;

    const playingChanged = after.musicPlaying !== before.musicPlaying;
    const trackChanged = after.currentTrack !== before.currentTrack;

    if (playingChanged || trackChanged) {
      const client = getMQTTClient();
      const message = after.musicPlaying ? String(after.currentTrack) : "off";

      return new Promise((resolve, reject) => {
        client.on("connect", () => {
          client.publish(`cradle/${uid}/music`, message, {}, (err) => {
            client.end();
            err ? reject(err) : resolve();
          });
        });
        client.on("error", (err) => {
          client.end();
          reject(err);
        });
      });
    }
  }
);
