import { useState, useEffect, useCallback } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [stdid, setStdid] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลผู้ใช้
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
        navigation.navigate("Login");
        return;
      }

      const uid = currentUser.uid;
      const userDoc = doc(db, "users", uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        setName(data.name || "");
        setStdid(data.stdid || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setImgUrl(data.imgUrl || "");
      } else {
        Alert.alert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้");
      }
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ใช้ useFocusEffect เพื่อโหลดข้อมูลใหม่ทุกครั้งที่เข้าหน้า
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    try {
      const uid = auth.currentUser.uid;
      await updateDoc(doc(db, "users", uid), {
        name,
        phone,
        imgUrl,
      });

      Alert.alert("บันทึกสำเร็จ!", "ข้อมูลของคุณถูกอัปเดตแล้ว");
      navigation.goBack(); // กลับไปหน้าโปรไฟล์

      // ✅ รีเฟรชข้อมูลใหม่หลังจากบันทึกสำเร็จ
      fetchUserData();
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ชื่อ" />
      <TextInput style={styles.input} value={stdid} placeholder="รหัสนักศึกษา" keyboardType="numeric" editable={false} />
      <TextInput style={styles.input} value={email} placeholder="Email" keyboardType="email-address" editable={false} />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="เบอร์โทรศัพท์" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={imgUrl} onChangeText={setImgUrl} placeholder="URL รูปโปรไฟล์ (ไม่บังคับ)" />

      <Button title="บันทึกการแก้ไข" onPress={handleSave} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
});
