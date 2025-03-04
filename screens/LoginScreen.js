import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  StatusBar
} from "react-native";
import { loginWithEmail } from "../firebase/auth";
import { useFonts } from "expo-font";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-SemiBold.ttf"),
  });

  // Handle loading state for fonts
  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }


  const handleLogin = async () => {
    try {
      const userCredential = await loginWithEmail(email, password);
      console.log("Login Success:", userCredential.user);
      navigation.navigate("Home");
    } catch (error) {
      console.error("❌ Login Failed:", error.message);
      setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/login.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>เข้าสู่ระบบ</Text>
        
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>อีเมล</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="กรอกอีเมลของคุณ"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>รหัสผ่าน</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="กรอกรหัสผ่านของคุณ"
              secureTextEntry
            />
          </View>

         
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerPrompt}>ยังไม่มีบัญชี? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>สมัครสมาชิก</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#f8f9fa",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontFamily: "Prompt-Bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputWrapper: {
    marginBottom: 15,
    width: "100%",
  },
  inputLabel: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    paddingLeft: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontFamily: "Prompt-Regular",
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#666",
    fontFamily: "Prompt-Regular",
    fontSize: 14,
  },
  errorContainer: {
    width: "100%",
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
    fontFamily: "Prompt-Regular",
  },
  loginButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Prompt-Bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  registerPrompt: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Prompt-Regular",
  },
  registerText: {
    color: "#3b82f6",
    fontSize: 16,
    fontFamily: "Prompt-Bold",
  },
});