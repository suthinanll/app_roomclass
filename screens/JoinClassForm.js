import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from "react-native";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function JoinClassForm({ route, navigation }) {
    const { cid } = route.params; // รับค่า cid จากหน้า AddClass
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [room, setRoom] = useState("");
    
    useEffect(() => {
        fetchClassData();
    }, []);

    const fetchClassData = async () => {
        try {
            const classRef = doc(db, `classroom/${cid}`);
            const classSnap = await getDoc(classRef);

            if (classSnap.exists()) {
                const classData = classSnap.data();
                setName(classData.name || "ไม่มีชื่อคลาส");
                setCode(classData.code || "ไม่มีรหัสวิชา");
                setRoom(classData.room || "ไม่มีข้อมูลห้อง");
            } else {
                setName("ไม่พบข้อมูลคลาส");
                setCode("ไม่พบรหัสวิชา");
                setRoom("ไม่พบข้อมูล");
            }
        } catch (error) {
            console.error("🔥 Error fetching class data:", error.message);
            setName("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            setCode("เกิดข้อผิดพลาด");
            setRoom("เกิดข้อผิดพลาด");
        }
    };

    const handleJoin = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("ข้อผิดพลาด", "กรุณาเข้าสู่ระบบก่อน");
            navigation.navigate("Login");
            return;
        }

        try {
            const studentRef = doc(db, `classroom/${cid}/students/${user.uid}`);
            await setDoc(studentRef, {
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
            <Text style={styles.classInfo}>ชื่อคลาส: {name}</Text>
            <Text style={styles.classInfo}>รหัสวิชา: {code}</Text>
            <Text style={styles.classInfo}>ห้อง: {room}</Text>
            <Text style={styles.subtitle}>Class ID: {cid}</Text>

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
