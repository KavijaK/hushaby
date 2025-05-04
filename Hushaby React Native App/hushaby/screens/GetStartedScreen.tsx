import { useNavigation } from "@react-navigation/native";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const backdrop = require("../assets/getstarted.webp");

const GetStartedScreen = () => {
    const navigation = useNavigation();
    return (
        <ImageBackground source={backdrop} resizeMode="cover" style={styles.container}>
            <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sloganText}>SMART IoT BABY CRADLE</Text>    
                <Text style={styles.headerText}>Hushaby</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity activeOpacity={0.85} 
                    style={{...styles.button, ...styles.loginButton}}
                    onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.buttonText}>
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} 
                    style={{...styles.button, ...styles.signUpButton}}
                    onPress={() => navigation.navigate("Register")}>
                    <Text style={{...styles.buttonText, ...styles.signUpText}}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
            </SafeAreaView>
        </ImageBackground>
    );
  };
  
  export default GetStartedScreen;
  
  const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: "space-between",
        paddingVertical: "10%"
    },
    header: {
        flex: 0.25,
        alignItems: "center",
    },
    headerText: {
        fontFamily: "Poppins_700Bold",
        color: "#4E598C",
        fontSize: 45,
    },
    sloganText: {
        fontFamily: "Poppins_500Medium",
        color: "#4E598C",
        fontSize: 24
    },
    buttonContainer: {
        flex: 0.25,
        alignItems: "center",
    },
    button: {
        borderRadius: 30,             
        paddingVertical: "4%",
        width: "75%",
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',            // Nice subtle shadow for elevation
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginVertical: 8,
      },
      buttonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        fontFamily: "Poppins_500Medium",
      },
      loginButton: {
        backgroundColor:"#4E598C"
      },
      signUpButton: {
        borderColor: "#4E598C",
        borderWidth: 3
      },
      signUpText: {
        color: "#4E598C"
      }
})