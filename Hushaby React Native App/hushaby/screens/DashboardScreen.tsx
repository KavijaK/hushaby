import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";


const cradleImg = require("../assets/logo.png"); 

const DashboardScreen = () => {
  const [fanOn, setFanOn] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
       <View style={styles.panel}>


      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.profileCircle}>
          <Ionicons name="person" size={28} color="#4E598C" />
        </View>
      </View>
      <View style={styles.illustrationContainer}>
        <Image
          source={cradleImg}
          style={styles.cradleImage}
          resizeMode="contain"
        />
        <Text style={styles.sleepZ}>💤</Text>
      </View>
      <View style={styles.cardsContainer}>
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="thermometer" size={28} color="#FF8C42" style={styles.cardIcon} />
          <Text style={styles.cardText}>Room Temperature</Text>
          <Text style={styles.cardValue}>72°F</Text>
        </View>

        <TouchableOpacity style={styles.cardRow} activeOpacity={0.8}>
          <FontAwesome5 name="baby" size={24} color="#4E598C" style={styles.cardIcon} />
          <Text style={styles.cardText}>Diaper</Text>
          <Ionicons name="chevron-forward" size={24} color="#BFC3D1" />
        </TouchableOpacity>
    
        <TouchableOpacity style={styles.cardRow} activeOpacity={0.8}>
          <Ionicons name="musical-notes" size={28} color="#4E598C" style={styles.cardIcon} />
          <Text style={styles.cardText}>Music</Text>
        </TouchableOpacity>
    
        <View style={styles.cardRow}>
          <MaterialCommunityIcons name="fan" size={28} color="#232343" style={styles.cardIcon} />
          <Text style={styles.cardText}>Cradle Fan</Text>
          <Switch
            trackColor={{ false: "#ddd", true: "#4E598C" }}
            thumbColor={fanOn ? "#FCAF58" : "#fff"}
            ios_backgroundColor="#ddd"
            onValueChange={setFanOn}
            value={fanOn}
          />
        </View>
      </View>
      </View> 

    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4E598C",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4E598C",
    paddingHorizontal: 30,
    paddingTop: "10%",
    paddingBottom: "10%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    paddingHorizontal: 5,
    fontFamily: "Poppins_700Bold",
  },
  profileCircle: {
    backgroundColor: "#fff",
    borderRadius: 26,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 3,
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 22,
  },
  cradleImage: {
    width: 170,
    height: 120,
  },
  sleepZ: {
    position: "absolute",
    right: 40,
    top: 28,
    fontSize: 28,
    color: "#4E598C",
    opacity: 0.8,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 4,
  },
  cardRow: {
    backgroundColor: "#FFF8EF",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
    shadowColor: "#F9C784",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 7,
    elevation: 2,
  },
  cardIcon: {
    marginRight: 18,
  },
  cardText: {
    fontSize: 19,
    color: "#232343",
    fontFamily: "Poppins_600SemiBold",
    flex: 1,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FCAF58",
    fontFamily: "Poppins_600SemiBold",
  },
  panel: {
    flex: 1,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: "8%",
    overflow: "hidden",
  },
});

