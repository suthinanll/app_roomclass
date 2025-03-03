import React, { useState, useEffect, useRef } from "react"; // ✅ เพิ่ม useRef
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

const Checkclass = ({ route }) => {
  const { cid, cno } = route.params;
  const navigation = useNavigation();
  const uid = auth.currentUser?.uid;
  const hasNavigated = useRef(false); // ✅ ใช้ useRef เพื่อป้องกัน navigate ซ้ำ

  const [subjectName, setSubjectName] = useState("");
  const [remark, setRemark] = useState("");
  const [questionShow, setQuestionShow] = useState(false);

  // ✅ ดึงข้อมูลชื่อวิชา
  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const subjectDoc = await getDoc(doc(db, "classroom", cid));
        if (subjectDoc.exists()) {
          setSubjectName(subjectDoc.data().name || "ไม่พบชื่อวิชา");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลวิชา:", error);
      }
    };

    fetchSubjectData();
  }, [cid]);

  // ✅ ดึงข้อมูล question_show จาก Firestore
  useEffect(() => {
    const questionRef = doc(db, `classroom/${cid}/checkin/${cno}`);
    const unsubscribe = onSnapshot(questionRef, (snapshot) => {
      if (snapshot.exists()) {
        setQuestionShow(snapshot.data().question_show || false);
      }
    });

    return () => unsubscribe();
  }, [cid, cno]);

  // ✅ ตรวจสอบว่าเมื่อ questionShow เป็น true ให้ navigate
  useEffect(() => {
    if (questionShow && !hasNavigated.current) {
      hasNavigated.current = true; // ✅ ป้องกันไม่ให้ navigate ซ้ำ
      navigation.navigate("QA", { cid, cno });
    }
  }, [questionShow, navigation, cid, cno]);

  const handleSaveRemark = async () => {
    if (!remark) {
      Alert.alert("ข้อผิดพลาด", "กรุณากรอกหมายเหตุ");
      return;
    }

    try {
      const remarkRef = doc(db, `classroom/${cid}/checkin/${cno}/students/${uid}`);
      await setDoc(remarkRef, { remark }, { merge: true });
      Alert.alert("สำเร็จ", "บันทึกหมายเหตุสำเร็จ!");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกหมายเหตุ:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกหมายเหตุได้");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายละเอียดวิชา</Text>
      <Text style={styles.text}>รหัสวิชา: {cid}</Text>
      <Text style={styles.text}>ชื่อวิชา: {subjectName}</Text>

      <Text style={styles.label}>หมายเหตุ</Text>
      <TextInput
        style={styles.input}
        placeholder="กรอกหมายเหตุ..."
        value={remark}
        onChangeText={setRemark}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveRemark}>
        <Text style={styles.buttonText}>บันทึก</Text>
      </TouchableOpacity>

      {questionShow && (
        <TouchableOpacity
          style={styles.questionButton}
          onPress={() => navigation.navigate("QA", { cid, cno })}
        >
          <Text style={styles.questionButtonText}>ไปที่หน้าถามตอบ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: "bold",
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
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  questionButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  questionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Checkclass;
