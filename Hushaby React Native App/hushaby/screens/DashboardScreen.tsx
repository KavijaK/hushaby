import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Image, ScrollView, RefreshControl } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const cradleImg = require("../assets/dashboard_vector.png");
const cradleIcon = require("../assets/icons/cradle.png");
const cryingIcon = require("../assets/icons/crying-baby.png");
const babyIcon = require("../assets/icons/baby.png");
const profilePicture = require("../assets/profile.webp");

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [fanOn, setFanOn] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(0);
  const [rockerOn, setRockerOn] = useState(false);

  const fetchUserData = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;
      const docRef = doc(FIREBASE_DB, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setFanOn(data.cradleFanOn);
        setFanSpeed(data.cradleFanSpeed);
        setRockerOn(data.autoRockerOn);
      } else {
        console.warn("No user data found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log("User logged out");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
    }
  };

  const toggleRocker = async () => {
    setRockerOn(!rockerOn);

    const userDocRef = doc(FIREBASE_DB, 'users', userData.uid);

    try {
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const current = docSnap.data().autoRockerOn;
        const newValue = !current;

        await updateDoc(userDocRef, { autoRockerOn: newValue });

        console.log(`autoRockerOn toggled to: ${newValue}`);
      } 
      else {
        console.warn('User document does not exist');
      }
    } catch (error) {
      console.error('Error toggling autoRockerOn:', error);
    }
  };

  const toggleCradleFan = async () => {
    setFanOn(prev => !prev); // Assuming you're using this state in the UI

    const userDocRef = doc(FIREBASE_DB, 'users', userData.uid);

    try {
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const current = docSnap.data().cradleFanOn;
        const newValue = !current;

        await updateDoc(userDocRef, { cradleFanOn: newValue });

        console.log(`cradleFanOn toggled to: ${newValue}`);
      } else {
        console.warn('User document does not exist');
      }
    } catch (error) {
      console.error('Error toggling cradleFanOn:', error);
    }
};


  const cradleWetness = userData?.diaperWetness ?? 0;
  const roomTemperature = userData?.roomTemperature ?? "--";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hi {userData?.parentName ?? "there"}!</Text>
          {!profilePicture ? (
            <View style={styles.profileCircle}>
              <Ionicons name="person" size={28} color="#4E598C" />
            </View>
          ) : (
            <View style={styles.avatar}>
              <Image style={styles.avatar} source={profilePicture} />
            </View>
          )}
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.illustrationContainer}>
            <Image source={cradleImg} style={styles.cradleImage} />
          </View>

          <View style={styles.row}>
            <View style={styles.cardSquare}>
              <View style={[styles.circle, { backgroundColor: "#FCAF58" }]}>
                <MaterialCommunityIcons name="thermometer" size={32} color="#fff" />
              </View>
              <Text style={styles.cardLabel}>Room Temp</Text>
              <Text style={styles.tempValue}>{roomTemperature}°C</Text>
            </View>

            <View style={styles.cardWide}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <FontAwesome5 name="baby" size={26} color="#7C5E99" style={{ marginRight: 8 }} />
                <Text style={styles.wideLabel}>Cradle Wetness</Text>
              </View>
              <View style={styles.levelRow}>
                <LinearGradient
                  colors={["#F9C784", "#FF8C42"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[{ width: `${cradleWetness}%` },styles.levelBarBgWide]}
                >
                  <View style={styles.levelBarFillWide} />
                </LinearGradient>
                <Text style={styles.levelBarPercentWide}>{cradleWetness}%</Text>
              </View>
              <Text style={styles.levelDesc}>{cradleWetness > 80 ? "Change Soon!" : "All Good"}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.cardWide} activeOpacity={0.88}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <MaterialCommunityIcons name="fan" size={26} color="#5AD2F4" style={{ marginRight: 8 }} />
                <Text style={styles.wideLabel}>Cradle Fan</Text>
              </View>
              <View style={styles.levelRow}>
                <LinearGradient
                  colors={["#C4E7F5", "#5AD2F4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[{ width: `${fanSpeed}%` }, styles.levelBarBgWide]}
                >
                  <View style={[styles.levelBarFillFanWide, ]} />
                </LinearGradient>
                <Text style={styles.levelBarPercentFanWide}>{fanSpeed}%</Text>
              </View>
              <View style={styles.fanSwitchRow}>
                <Text style={[styles.levelDesc, { marginTop: 3, color: fanOn ? "#5AD2F4" : "#aaa" }]}>{fanOn ? "On" : "Off"}</Text>
                <Switch
                  trackColor={{ false: "#ddd", true: "#4E598C" }}
                  thumbColor={fanOn ? "#FCAF58" : "#fff"}
                  ios_backgroundColor="#ddd"
                  onValueChange={toggleCradleFan}
                  value={fanOn}
                  style={{ marginLeft: 6, marginTop: -3 }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Music")} style={[styles.cardSquare, styles.musicCard]} activeOpacity={0.70}>
              <View style={[styles.circle, { backgroundColor: "#FF8C42" }]}>
                <Ionicons name="musical-notes" size={28} color="#fff" />
              </View>
              <Text style={[styles.cardLabel, { color: "#fff" }]}>Music</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={toggleRocker} activeOpacity={0.8} style={!rockerOn ? styles.autoRocker : { ...styles.autoRocker, ...styles.rockerOn }}>
              <Image source={cradleIcon} style={styles.iconStyles} />
            </TouchableOpacity>
            <View style={styles.cryStatus}>
              {userData?.isBabyCrying ? (
                <Image source={cryingIcon} style={styles.iconStyles} />
              ) : (
                <Image source={babyIcon} style={styles.iconStyles} />
              )}
            </View>
            <TouchableOpacity style={styles.logout} onPress={handleLogout} activeOpacity={0.8}>
              <MaterialIcons name="logout" size={45} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;


const CARD_SIZE = 130;
const CARD_WIDE_WIDTH = CARD_SIZE * 1.65; // wide cards are 65% longer

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
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4E598C",
    paddingHorizontal: 30,
    paddingTop: "10%",
    paddingBottom: "5%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    paddingHorizontal: 5,
    fontFamily: "Poppins_600SemiBold",
  },
  profileCircle: {
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: 60,
    height: 60,
  },

  illustrationContainer: {
    width: "100%",
    marginTop: 0,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "5%",
},
cradleImage: {
    width: "100%",
    height: 160,        // You can try 140, 160, 180, or use Dimensions.get('window').width * 0.35 for % of screen height
    resizeMode: "cover", // This is important!
},
  sleepZ: {
    position: "absolute",
    right: 40,
    top: 14,
    fontSize: 24,
    color: "#4E598C",
    opacity: 0.8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  cardSquare: {
    backgroundColor: "#f9dfbe",
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 24,
    marginVertical: 8,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F9C784",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 3,
    position: "relative",
  },
  cardWide: {
    backgroundColor: "#f9dfbe",
    width: CARD_WIDE_WIDTH,
    height: CARD_SIZE,
    borderRadius: 24,
    marginVertical: 8,
    marginHorizontal: 2,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 22,
    paddingRight: 14,
    shadowColor: "#F9C784",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 3,
    position: "relative",
  },
  wideLabel: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#7C5E99",
    marginLeft: 2,
  },
  cardLabel: {
    fontSize: 16,
    color: "#232343",
    fontFamily: "Poppins_700Bold",
    marginTop: 9,
    marginBottom: 3,
    textAlign: "center",
  },
  // Room Temp
  tempValue: {
    fontSize: 26,
    color: "#4E598C",
    fontFamily: "Poppins_700Bold",
    marginBottom: 2,
  },
  cardDetail: {
    fontSize: 14,
    color: "#FF8C42",
    fontFamily: "Poppins_500Medium",
    marginTop: 2,
    textAlign: "center",
  },
  // Level bar and percent
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    width: "70%",
    paddingRight: 8,
    justifyContent: "flex-start",
  },
  levelBarBgWide: {
    height: 18,
    backgroundColor: "#F9C784",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 13,
    justifyContent: "center",
    position: "relative",
  },
  levelBarFillWide: {
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: 10,
    position: "absolute",
    left: 0,
    top: 0,
  },
  levelBarFillFanWide: {
    height: "100%",
    backgroundColor: "transparent",
    borderRadius: 10,
    position: "absolute",
    left: 0,
    top: 0,
  },
  levelBarPercentWide: {
    fontSize: 25,
    fontWeight: "700",
    color: "#FF8C42",
    fontFamily: "Poppins_700Bold",
    minWidth: 44,
    textAlign: "left",
    marginLeft: 2,
  },
  levelBarPercentFanWide: {
    fontSize: 25,
    fontWeight: "700",
    color: "#5AD2F4",
    fontFamily: "Poppins_700Bold",
    minWidth: 44,
    textAlign: "left",
    marginLeft: 2,
  },
  levelDesc: {
    fontSize: 13,
    color: "#A8A8A8",
    fontFamily: "Poppins_400Regular",
    marginTop: 2,
    alignSelf: "flex-start",
    textAlign: "left",
  },
  // Cradle Fan extras
  fanSwitchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginLeft: -4,
  },
  // Music Card
  musicCard: {
    backgroundColor: "#FF8C42",
    shadowColor: "#FF8C42",
  },
  musicTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 2,
    width: "92%",
    textAlign: "center",
  },
  musicChevron: {
    position: "absolute",
    right: 13,
    bottom: 12,
    opacity: 0.7,
  },
  // Circle Icon Backgrounds
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  logout : {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#FCAF58",
    alignItems: "center",
    justifyContent: "center",
  }, 
  autoRocker: {
    height: 80,
    width: "34%",
    borderRadius: 30,
    backgroundColor: "#b0d7f9",
    alignItems: "center",
    justifyContent: "center",
  },
  rockerOn: {
    borderWidth: 5,
    borderColor: "#b0d7f9",
    backgroundColor: "#5fb0f7"
  },
  cryStatus: {
    height: 80,
    width: "34%",
    borderRadius: 30,
    backgroundColor: '#b0d7f9',
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyles: {
    width: 50,
    height: 50,
  }
});
