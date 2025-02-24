import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase/firebaseConfig";

export default function CheckinScreen({ route }) {
  const { cid } = route.params;
  const [cno, setCno] = useState("");
  const [code, setCode] = useState("");

  const handleCheckin = async () => {
    const uid = auth.currentUser.uid;
    const stdid = "รหัสนักศึกษา"; // ดึงจาก Firebase
    const name = "ชื่อ-นามสกุล"; // ดึงจาก Firebase
    const timestamp = new Date().toISOString();

    const checkinRef = ref(db, `classroom/${cid}/checkin/${cno}/students/${uid}`);
    await set(checkinRef, { stdid, name, date: timestamp });

    alert("เช็คชื่อสำเร็จ!");
  };

  return (
    <View>
      <Text>รหัสวิชา: {cid}</Text>
      <TextInput value={cno} onChangeText={setCno} placeholder="ลำดับ cno" />
      <TextInput value={code} onChangeText={setCode} placeholder="รหัสเข้าเรียน" />
      <Button title="เช็คชื่อ" onPress={handleCheckin} />
    </View>
  );
}
