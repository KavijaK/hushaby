import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const tracks = [
  { id: 1, label: "Lullabies & Tunes" },
  { id: 2, label: "Soothing Song" },
  { id: 3, label: "Bedtime Music" },
];

const musicBackground= require("../assets/music.webp");

const MusicScreen = () => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);

  const handlePlay = async (trackId: number) => {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      console.warn("User not logged in");
      return;
    }

    const uid = user.uid;
    const userDocRef = doc(FIREBASE_DB, 'users', uid);

    const isSameTrack = trackId === currentTrack;
    const newTrack = isSameTrack ? null : trackId;
    const playing = !isSameTrack;

    setCurrentTrack(newTrack); // Update UI

    try {
      await updateDoc(userDocRef, {
        musicPlaying: playing,
        currentTrack: newTrack,
      });

      console.log(`Updated music state: ${playing ? "Playing" : "Stopped"}, Track: ${newTrack}`);
    } catch (error) {
      console.error("Error updating music state in Firestore:", error);
    }
  };
  
  return (
    <ImageBackground source={musicBackground} resizeMode="cover" style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Music That Cradles </Text>
        </View>
        <View style={styles.body}>
          {tracks.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={[
              styles.trackCard,
              currentTrack === track.id && styles.trackCardActive,
            ]}
            onPress={() => handlePlay(track.id)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                currentTrack === track.id
                  ? ["#FF8C42", "#FCAF58"]
                  : ["#fff", "#f9dfbe"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.trackGradient}
            >
              <Ionicons
                name={currentTrack === track.id ? "pause" : "play"}
                size={30}
                color={currentTrack === track.id ? "#fff" : "#4E598C"}
                style={styles.playIcon}
              />
              <Text
                style={[
                  styles.trackLabel,
                  currentTrack === track.id && styles.trackLabelActive,
                ]}
              >
                {track.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};


export default MusicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  body: {
    flex: 0.75,
    paddingHorizontal: 20,
  },
  header:{
    flex: 0.25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 30,
    color: "white",
    alignSelf:"center"
  },
  trackList: {
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  trackCard: {
    height: 80,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  trackGradient: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  playIcon: {
    marginRight: 18,
  },
  trackLabel: {
    fontSize: 20,
    color: "#4E598C",
    fontFamily: "Poppins_600SemiBold",
  },
  trackLabelActive: {
    color: "#fff",
  },
  trackCardActive: {
    borderColor: "#FF8C42",
    borderWidth: 2,
  },
});
