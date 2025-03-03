import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

const QuestionScreen = ({ route }) => {
  const { cid, cno } = route.params;
  const navigation = useNavigation();
  const [answer, setAnswer] = useState("");
  const [qno, setQno] = useState(null);
  const [stdid, setStdid] = useState(null); // เก็บรหัสนักศึกษา
  const [name, setName] = useState(""); // เก็บชื่อของนักศึกษา
  const uid = auth.currentUser?.uid;

  // ✅ ดึงข้อมูลผู้ใช้ (ชื่อและรหัสนักศึกษา) จาก Firestore
  const fetchStudentInfo = async () => {
    if (!uid) return;

    try {
      const userDoc = doc(db, `users/${uid}`); // ดึงข้อมูลจาก collection "users"
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setName(userData.name || "ไม่พบชื่อผู้ใช้");
        setStdid(userData.stdid || "ไม่พบรหัสนักศึกษา");
      } else {
        console.warn("⚠️ ไม่พบข้อมูลผู้ใช้");
      }
    } catch (error) {
      console.error("❌ ดึงข้อมูลผู้ใช้ไม่สำเร็จ:", error);
    }
  };

  // ✅ ดึง question_no จาก Firestore
  const fetchQuestionNo = async () => {
    if (!cid || !cno) return;
  
    try {
      const questionDoc = doc(db, `classroom/${cid}/checkin/${cno}`);
      const questionSnap = await getDoc(questionDoc);
  
      if (questionSnap.exists()) {
        const questionData = questionSnap.data();
        setQno(questionData.question_no || "1"); // ใช้ "1" เป็นค่าเริ่มต้นถ้าไม่มีข้อมูล
      } else {
        console.warn("⚠️ ไม่มีข้อมูล question_no ใน Firestore");
      }
    } catch (error) {
      console.error("❌ ดึง question_no ไม่สำเร็จ:", error);
    }
  };
  
  useEffect(() => {
    console.log("🚀 CID:", cid, "CNO:", cno);
    fetchQuestionNo();
    fetchStudentInfo();
  }, []);

  // ✅ บันทึกคำตอบ พร้อมรหัสนักศึกษา, ชื่อ, และ timestamp
  const handleSubmitAnswer = async () => {
    if (!answer) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกคำตอบ");
      return;
    }
    if (!qno) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบหมายเลขคำถาม");
      return;
    }
    if (!stdid) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบรหัสนักศึกษา");
      return;
    }
    if (!name) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบชื่อผู้ใช้");
      return;
    }

    try {
      const answerRef = doc(db, `classroom/${cid}/checkin/${cno}/answers/${qno}/students/${uid}`);
      await setDoc(answerRef, { 
        text: answer, 
        stdid: stdid,
        name: name,  // บันทึกชื่อผู้ใช้
        timestamp: new Date() // บันทึกเวลา
      }, { merge: true });

      Alert.alert("สำเร็จ", "ส่งคำตอบสำเร็จ!");
      setAnswer("");
      navigation.goBack();
    } catch (error) {
      console.error("❌ ส่งคำตอบไม่สำเร็จ:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถส่งคำตอบได้");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ตอบคำถาม</Text>
      <Text>หมายเลขคำถาม: {qno || "กำลังโหลด..."}</Text>
      <Text>รหัสนักศึกษา: {stdid || "กำลังโหลด..."}</Text>
      <Text>ชื่อผู้ใช้: {name || "กำลังโหลด..."}</Text>
      <TextInput
        style={styles.input}
        placeholder="กรอกคำตอบ..."
        value={answer}
        onChangeText={setAnswer}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmitAnswer} disabled={!qno || !stdid || !name}>
        <Text style={styles.buttonText}>ส่งคำตอบ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 10, marginVertical: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, backgroundColor: "#fff" },
  button: { backgroundColor: "#28a745", padding: 12, borderRadius: 5, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default QuestionScreen;
