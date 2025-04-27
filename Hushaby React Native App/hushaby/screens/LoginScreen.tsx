import { useNavigation } from "@react-navigation/native";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";
const backdrop = require("../assets/getstarted.webp");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground source={backdrop} resizeMode="cover" style={styles.container}>
      {/* Translucent overlay */}
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text style={styles.headerText}>Welcome</Text>
                <Text style={styles.sloganText}>Sign in to rock your cradle!</Text>
              </View>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address or Username"
                  placeholderTextColor="#BFC3D1"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BFC3D1"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.loginButton}
                  onPress={() => {/* handle login here */}}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {/* handle forgot password */}}
                >
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bottomLinks}>
                <Text style={styles.bottomText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 30, 50, 0.48)',
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 2,
    justifyContent: "space-between",
  },
  header: {
    flex: 0.23,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: "8%",
  },
  headerText: {
    fontFamily: "Poppins_700Bold",
    color: "#fff",
    fontSize: 38,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  sloganText: {
    fontFamily: "Poppins_500Medium",
    color: "#C9CAE6",
    fontSize: 20,
    marginTop: 1,
  },
  formContainer: {
    flex: 0.55,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    width: "80%",
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.90)",
    marginBottom: 18,
    paddingHorizontal: 18,
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: "#232343",
    borderColor: "#C5CAE9",
    borderWidth: 1.2,
  },
  loginButton: {
    backgroundColor: "#4E598C",
    borderRadius: 30,
    paddingVertical: 14,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.19,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Poppins_500Medium",
    letterSpacing: 0.5,
  },
  forgotPassword: {
    color: "#E2E3F7",
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    marginBottom: 10,
    textDecorationLine: "underline",
    opacity: 0.87,
  },
  bottomLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.09,
  },
  bottomText: {
    color: "#BFC3D1",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    marginRight: 7,
  },
  signUpLink: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    textDecorationLine: "underline",
  },
});
