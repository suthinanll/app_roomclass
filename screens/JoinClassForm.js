import { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function JoinClassForm({ route, navigation }) {
    const { cid } = route.params; // รับค่า cid จากหน้า AddClass
    const [className, setClassName] = useState("");
    const [group, setGroup] = useState("");
    const [room, setRoom] = useState("");
    const [subject, setSubject] = useState("");
    const [stdid, setStdid] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        fetchClassData();
    }, []);

    const fetchClassData = async () => {
        try {
            const classRef = doc(db, `classroom/${cid}`);
            const classSnap = await getDoc(classRef);

            if (classSnap.exists()) {
                const classData = classSnap.data();
                setClassName(classData.className || "ไม่มีชื่อคลาส");
                setGroup(classData.group || "ไม่มีข้อมูลกลุ่ม");
                setRoom(classData.room || "ไม่มีข้อมูลห้อง");
                setSubject(classData.subject || "ไม่มีข้อมูลวิชา");
            } else {
                setClassName("ไม่พบข้อมูลคลาส");
                setGroup("ไม่พบข้อมูล");
                setRoom("ไม่พบข้อมูล");
                setSubject("ไม่พบข้อมูล");
            }
        } catch (error) {
            console.error("🔥 Error fetching class data:", error.message);
            setClassName("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            setGroup("เกิดข้อผิดพลาด");
            setRoom("เกิดข้อผิดพลาด");
            setSubject("เกิดข้อผิดพลาด");
        }
    };

    const handleJoin = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("ข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อน");
            navigation.navigate("Login");
            return;
        }

        if (!stdid.trim() || !name.trim()) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        try {
            const studentRef = doc(db, `classroom/${cid}/students/${user.uid}`);
            await setDoc(studentRef, {
                stdid,
                name,
                uid: user.uid,
                email: user.email,
            });

            const userClassRef = doc(db, `users/${user.uid}/classroom/${cid}`);
            await setDoc(userClassRef, { status: 2 });

            Alert.alert("สำเร็จ", "เข้าร่วมคลาสเรียบร้อย!");
            navigation.replace("Home");
        } catch (error) {
            console.error("🔥 Error joining class:", error.message);
            Alert.alert("เกิดข้อผิดพลาด", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Class</Text>
            <Text style={styles.classInfo}>ชื่อคลาส: {className}</Text>
            <Text style={styles.classInfo}>กลุ่ม: {group}</Text>
            <Text style={styles.classInfo}>ห้อง: {room}</Text>
            <Text style={styles.classInfo}>วิชา: {subject}</Text>
            <Text style={styles.subtitle}>Class ID: {cid}</Text>

            <TextInput
                style={styles.input}
                value={stdid}
                onChangeText={setStdid}
                placeholder="รหัสนักศึกษา"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="ชื่อ - นามสกุล"
                autoCapitalize="words"
            />

            <TouchableOpacity style={styles.button} onPress={handleJoin}>
                <Text style={styles.buttonText}>เข้าร่วมคลาส</Text>
            </TouchableOpacity>
        </View>
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
    classInfo: {
        fontSize: 18,
        marginBottom: 5,
        color: "#007bff",
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
        color: "#555",
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
        backgroundColor: "#28a745",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
