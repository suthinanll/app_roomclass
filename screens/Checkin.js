import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

const Checkin = ({ route }) => {
  const { cid } = route.params;
  const navigation = useNavigation();
  const [cno, setCno] = useState("");
  const [code, setCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentID, setStudentID] = useState("");
  const uid = auth.currentUser?.uid;

  // ✅ โหลดค่าที่เคยบันทึกไว้จาก AsyncStorage
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("lastCheckIn");
        if (storedData) {
          const { lastCid, lastCno } = JSON.parse(storedData);
          if (lastCid === cid) {
            setCno(lastCno);
            console.log("📌 โหลดข้อมูล CNO จาก Local Storage:", lastCno);
          }
        }
      } catch (error) {
        console.error("❌ โหลดข้อมูลไม่สำเร็จ:", error);
      }
    };
    loadStoredData();
  }, [cid]);

  // ✅ โหลดข้อมูลนักศึกษา
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!uid) return;
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStudentName(data.name || "ไม่พบชื่อ");
          setStudentID(data.stdid || "ไม่พบรหัสนักศึกษา");
        }
      } catch (error) {
        console.error("❌ ดึงข้อมูลนักศึกษาไม่สำเร็จ:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลนักศึกษาได้");
      }
    };
    fetchStudentData();
  }, [uid]);

  // ✅ ฟังก์ชันบันทึกข้อมูล cid และ cno ลงใน Local Storage
  const saveCheckInInfo = async () => {
    try {
      await AsyncStorage.setItem("lastCheckIn", JSON.stringify({ lastCid: cid, lastCno: cno }));
      console.log("✅ บันทึก CNO ลง Local Storage สำเร็จ!");
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการบันทึก:", error);
    }
  };

  // ✅ ฟังก์ชันเช็คชื่อ
  const handleCheckIn = async () => {
    if (!cno || !code) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const studentRef = doc(db, `classroom/${cid}/checkin/${cno}/students`, uid);
      await setDoc(studentRef, {
        stdid: studentID,
        name: studentName,
        date: serverTimestamp(),
      });

      await saveCheckInInfo(); // 📌 บันทึกข้อมูลลง Local Storage

      Alert.alert("สำเร็จ", "เช็คชื่อสำเร็จ!", [
        {
          text: "ตกลง",
          onPress: () => navigation.navigate("Checkclass", { cid, cno }),
        },
      ]);
    } catch (error) {
      console.error("❌ เช็คชื่อไม่สำเร็จ:", error);
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เช็คชื่อเข้าคลาส</Text>
      <TextInput
        style={styles.input}
        placeholder="หมายเลขคาบ (CNO)"
        value={cno}
        onChangeText={setCno}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="รหัสเช็คชื่อ"
        value={code}
        onChangeText={setCode}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
        <Text style={styles.buttonText}>เช็คชื่อ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Checkin;
