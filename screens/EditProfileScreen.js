import { useState, useEffect, useCallback } from "react";
import {
  View, TextInput, Text, Button, Alert, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useFonts } from "expo-font";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [stdid, setStdid] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

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

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleSave = async () => {
    try {
      const uid = auth.currentUser.uid;
      await updateDoc(doc(db, "users", uid), {
        name,
        phone,
        imgUrl,
      });
      Alert.alert("บันทึกสำเร็จ!", "ข้อมูลของคุณถูกอัปเดตแล้ว");
      navigation.goBack();
      fetchUserData();
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <Text style={styles.title}>แก้ไขข้อมูลโปรไฟล์</Text>
              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>ชื่อ</Text>
                  <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ชื่อ" />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>รหัสนักศึกษา</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={stdid}
                    placeholder="รหัสนักศึกษา"
                    keyboardType="numeric"
                    editable={false}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>อีเมล</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                    editable={false}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
                  <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="เบอร์โทรศัพท์" keyboardType="phone-pad" />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>URL รูปโปรไฟล์ (ไม่บังคับ)</Text>
                  <TextInput style={styles.input} value={imgUrl} onChangeText={setImgUrl} placeholder="URL รูปโปรไฟล์" />
                </View>
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                <Text style={styles.saveButtonText}>บันทึกการแก้ไข</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}  

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  saveButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Prompt-Bold",
  },
  disabledInput: {
    backgroundColor: '#f0f0f0', // สีเทาอ่อนเมื่อถูก disable
    color: '#808080' // สีตัวอักษรเทาเข้มขึ้นเล็กน้อย
  },
});