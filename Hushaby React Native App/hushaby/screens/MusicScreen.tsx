import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MusicScreen = () => {
  const tracks = [
    { id: 1, title: "Soothing Lullaby" },
    { id: 2, title: "Gentle Sleep Tune" },
    { id: 3, title: "Soft Cradle Music" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.panel}>
        <Text style={styles.headerTitle}>Baby Music</Text>
        {tracks.map((track) => (
          <TouchableOpacity key={track.id} style={styles.trackCard} activeOpacity={0.85}>
            <View style={styles.trackContent}>
              <Ionicons name="musical-notes" size={28} color="#fff" style={{ marginRight: 12 }} />
              <Text style={styles.trackTitle}>{track.title}</Text>
            </View>
            <Ionicons name="play-circle" size={36} color="#fff" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default MusicScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4E598C",
  },
  panel: {
    flex: 1,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: "8%",
  },
  headerTitle: {
    backgroundColor: "#4E598C",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    fontSize: 30,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    marginBottom: 20,
    height: "10%",
    textAlign: "center",
  },
  trackCard: {
    backgroundColor: "#FF8C42",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 22,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#FF8C42",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  trackContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackTitle: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },
});
