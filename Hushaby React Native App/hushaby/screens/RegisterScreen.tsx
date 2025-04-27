import { useNavigation } from "@react-navigation/native";
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useState } from "react";
const backdrop = require("../assets/getstarted.webp");

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [parentName, setParentName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [babyName, setBabyName] = useState("");

    return (
        <ImageBackground source={backdrop} resizeMode="cover" style={styles.container}>
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
                                <Text style={styles.headerText}>Create Account</Text>
                                <Text style={styles.sloganText}>Register your smart cradle!</Text>
                            </View>
                            <View style={styles.formContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Parent's Name"
                                    placeholderTextColor="#BFC3D1"
                                    value={parentName}
                                    onChangeText={setParentName}
                                    autoCapitalize="words"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor="#BFC3D1"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#BFC3D1"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#BFC3D1"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Baby's Name"
                                    placeholderTextColor="#BFC3D1"
                                    value={babyName}
                                    onChangeText={setBabyName}
                                    autoCapitalize="words"
                                />
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={styles.registerButton}
                                    onPress={() => {/* handle registration here */}}
                                >
                                    <Text style={styles.registerButtonText}>Register</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.bottomLinks}>
                                <Text style={styles.bottomText}>Already have an account?</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                    <Text style={styles.loginLink}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default RegisterScreen;


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
    },
    header: {
        alignItems: "center",
        marginTop: 24,
        marginBottom: 16,
    },
    headerText: {
        fontFamily: "Poppins_700Bold",
        color: "#fff",
        fontSize: 34,
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    sloganText: {
        fontFamily: "Poppins_500Medium",
        color: "#C9CAE6",
        fontSize: 19,
        marginTop: 2,
        marginBottom: 10,
    },
    formContainer: {
        alignItems: "center",
        width: "100%",
        marginBottom: 12,
    },
    input: {
        width: "80%",
        height: 52,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.93)",
        marginBottom: 15,
        paddingHorizontal: 18,
        fontSize: 17,
        fontFamily: "Poppins_400Regular",
        color: "#232343",
        borderColor: "#C5CAE9",
        borderWidth: 1.1,
    },
    registerButton: {
        backgroundColor: "#4E598C",
        borderRadius: 30,
        paddingVertical: 13,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.17,
        shadowRadius: 4,
        elevation: 4,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 21,
        fontWeight: "700",
        fontFamily: "Poppins_500Medium",
        letterSpacing: 0.5,
    },
    bottomLinks: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        marginTop: 8,
    },
    bottomText: {
        color: "#BFC3D1",
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        marginRight: 7,
    },
    loginLink: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold",
        textDecorationLine: "underline",
    },
});
