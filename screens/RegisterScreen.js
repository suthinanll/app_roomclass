import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useFonts } from "expo-font";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [stdid, setStdid] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [password, setPassword] = useState("");

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-SemiBold.ttf"),
  });

  // Handle loading state for fonts
  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const handleRegister = async () => {
    if (!name || !stdid || !phone || !email || !password) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ สมัครสมาชิกสำเร็จ UID:", user.uid);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        stdid: stdid,
        email: email,
        phone: phone,
        imgUrl: imgUrl || "https://via.placeholder.com/150",
      });

      Alert.alert("สมัครสำเร็จ!", "กรุณาเข้าสู่ระบบ");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("สมัครไม่สำเร็จ", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
          

            <Text style={styles.title}>สมัครสมาชิก</Text>
            
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>ชื่อ</Text>
                <TextInput 
                  style={styles.input} 
                  value={name} 
                  onChangeText={setName} 
                  placeholder="กรอกชื่อของคุณ" 
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>รหัสนักศึกษา</Text>
                <TextInput 
                  style={styles.input} 
                  value={stdid} 
                  onChangeText={setStdid} 
                  placeholder="กรอกรหัสนักศึกษา" 
                  keyboardType="numeric" 
                />
              </View>
              
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
                <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
                <TextInput 
                  style={styles.input} 
                  value={phone} 
                  onChangeText={setPhone} 
                  placeholder="กรอกเบอร์โทรศัพท์" 
                  keyboardType="phone-pad" 
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>URL รูปโปรไฟล์ (ไม่บังคับ)</Text>
                <TextInput 
                  style={styles.input} 
                  value={imgUrl} 
                  onChangeText={setImgUrl} 
                  placeholder="ระบุ URL รูปภาพ" 
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>รหัสผ่าน</Text>
                <TextInput 
                  style={styles.input} 
                  value={password} 
                  onChangeText={setPassword} 
                  placeholder="กรอกรหัสผ่าน" 
                  secureTextEntry 
                />
              </View>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginPrompt}>มีบัญชีแล้ว? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontFamily: "Prompt-Bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  formContainer: {
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
  registerButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Prompt-Bold",
  },
  loginContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  loginPrompt: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Prompt-Regular",
  },
  loginText: {
    color: "#3b82f6",
    fontSize: 16,
    fontFamily: "Prompt-Bold",
  },
});