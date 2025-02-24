import { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [stdid, setStdid] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [password, setPassword] = useState("");

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
    <View style={styles.container}>
      <Text style={styles.title}>สมัครสมาชิก</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ชื่อ" />
      <TextInput style={styles.input} value={stdid} onChangeText={setStdid} placeholder="รหัสนักศึกษา" keyboardType="numeric" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="เบอร์โทรศัพท์" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={imgUrl} onChangeText={setImgUrl} placeholder="URL รูปโปรไฟล์ (ไม่บังคับ)" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

      <Button title="สมัครสมาชิก" onPress={handleRegister} />

      {/* 🔹 ลิงก์ไปหน้า Login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>มีบัญชีแล้ว? เข้าสู่ระบบ</Text>
      </TouchableOpacity>

    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  loginText: {
    marginTop: 15,
    fontSize: 16,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
