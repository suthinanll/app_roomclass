import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function AddClass({ route, navigation }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (route.params?.cid) {
      setCode(route.params.cid); // ✅ ตั้งค่ารหัสคลาสจาก QR Code
    }
  }, [route.params?.cid]);

  const handleJoinClass = async () => {
    if (!code.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกรหัสห้องเรียน");
      return;
    }

    try {
      const classRef = doc(db, "classroom", code);
      const classSnap = await getDoc(classRef);

      if (classSnap.exists()) {
        console.log("✅ ห้องเรียนถูกต้อง:", code);
        navigation.navigate("JoinClassForm", { cid: code });
      } else {
        Alert.alert("แจ้งเตือน", "ไม่พบห้องเรียนนี้");
      }
    } catch (error) {
      console.error("🔥 Error checking class:", error.message);
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Enter Code Class</Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Code Class"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleJoinClass}>
        <Text style={styles.buttonText}>Join Class</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("QRScan")}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
