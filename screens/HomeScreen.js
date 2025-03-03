import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    Alert,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image
} from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Card, Avatar, Button, IconButton, FAB } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]); // 🔹 เก็บข้อมูลคลาส

    // 📌 โหลดข้อมูลผู้ใช้
    const fetchUserData = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                Alert.alert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
                navigation.navigate("Login");
                return;
            }

            const uid = currentUser.uid;
            console.log("📌 Current User UID:", uid);

            const userDoc = doc(db, "users", uid);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                console.log("✅ ดึงข้อมูลผู้ใช้สำเร็จ:", userSnapshot.data());
                setUserData(userSnapshot.data());
            } else {
                console.log("❌ ไม่พบข้อมูลผู้ใช้ใน Firestore");
                setUserData(null);
            }

            await fetchUserClasses(uid); // 🔹 โหลดข้อมูลคลาสของผู้ใช้

        } catch (error) {
            console.log("🔥 Error fetching user data:", error.message);
            Alert.alert("เกิดข้อผิดพลาด", error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserClasses = async (uid) => {
        try {
            const classRef = collection(db, `users/${uid}/classroom`);
            const classSnap = await getDocs(classRef);
    
            const classList = [];
            for (let docSnap of classSnap.docs) {
                const cid = docSnap.id;
                const classroomRef = doc(db, "classroom", cid);
                const classroomSnap = await getDoc(classroomRef);
    
                if (classroomSnap.exists()) {
                    classList.push({
                        cid,
                        name: classroomSnap.data().name || "ไม่มีชื่อคลาส",
                        code: classroomSnap.data().code || "ไม่มีรหัส",
                        room: classroomSnap.data().room || "ไม่มีข้อมูลห้อง",
                        photo: classroomSnap.data().photo || "https://via.placeholder.com/100", // รูป
                    });
                }
            }
    
            setClasses(classList);
        } catch (error) {
            console.error("🔥 Error fetching user classes:", error.message);
            Alert.alert("เกิดข้อผิดพลาด", error.message);
        }
    };
    

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.replace("Login");
        } catch (error) {
            Alert.alert("เกิดข้อผิดพลาด", error.message);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            {userData ? (
                <>
                    {/* 🔹 การ์ดข้อมูลส่วนตัว */}
                    <Card style={styles.profileCard}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Edit")}
                            style={styles.editButtonContainer}
                        >
                            <IconButton icon="pencil" size={24} />
                        </TouchableOpacity>

                        <Card.Title
                            title={userData.name}
                            subtitle={`รหัสนักศึกษา : ${userData.stdid}`}
                            left={() => (
                                <Avatar.Image size={50} source={{ uri: userData.imgUrl }} />
                            )}
                        />
                        <Card.Content>
                            <Text style={styles.infoText}>อีเมล: {userData.email}</Text>
                            <Text style={styles.infoText}>เบอร์โทรศัพท์: {userData.phone}</Text>
                        </Card.Content>
                        <Card.Content>
                            <Button
                                mode="contained"
                                onPress={handleLogout}
                                style={{ marginTop: 20, backgroundColor: "red" }}
                            >
                                ออกจากระบบ
                            </Button>
                        </Card.Content>
                    </Card>

                    {/* 🔹 รายการคลาส */}
                    <Text style={styles.classTitle}>คลาสที่เข้าร่วม</Text>
                    {classes.length === 0 ? (
                        <Text style={styles.noClassText}>ไม่มีคลาสที่เข้าร่วม</Text>
                    ) : (
                        <FlatList
                        data={classes}
                        keyExtractor={(item) => item.cid}
                        numColumns={2} // แสดงเป็น 2 คอลัมน์
                        columnWrapperStyle={styles.row} // ใช้ flex สำหรับ grid
                        renderItem={({ item }) => (
                            <View style={styles.classCard}>
                                <Image 
                                    source={{ uri: item.photo }} 
                                    style={styles.photo} // ใช้ Image แทน Avatar.Image
                                />
                                <Text style={styles.className}>{item.name}</Text>
                                <Text style={styles.info}>รหัส: {item.code}</Text>
                                <Text style={styles.info}>ห้อง: {item.room}</Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => navigation.navigate("Checkin", { 
                                        cid: item.cid, 
                                        uid: userData?.stdid,  // ส่งรหัสนักศึกษาไปด้วย
                                        studentName: userData?.name // ส่งชื่อนักศึกษาไปด้วย
                                    })}
                                >
                                    <Text style={styles.buttonText}>เช็คชื่อ</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    
                    

                    )}

                    {/* ปุ่ม FAB สำหรับเพิ่มคลาส */}
                    <FAB
                        icon="plus"
                        style={styles.fab}
                        onPress={() => navigation.navigate("Addclass")}
                    />
                </>
            ) : (
                <Text style={styles.noDataText}>ไม่พบข้อมูลผู้ใช้</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    profileCard: {
        width: "100%",
        padding: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        backgroundColor: "white",
        position: "relative",
    },
    editButton: {
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 1,
    },
    infoText: {
        fontSize: 16,
        marginVertical: 4,
    },
    classTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    noClassText: {
        fontSize: 16,
        textAlign: "center",
        color: "#777",
    },

    // 🟢 **เพิ่มสไตล์สำหรับ Grid Layout**
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    classCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: "48%", // แบ่งให้เป็น 2 คอลัมน์
        alignItems: "center", // จัดให้อยู่ตรงกลาง
    },
    photo: {
        width: "100%", // ให้เต็มขนาดของ card
        height: 120,  // ปรับความสูงตามต้องการ
        borderRadius: 8, // มุมโค้งเล็กน้อย
        marginBottom: 10,
    },
    className: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    info: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
    },
    button: {
        marginTop: 10,
        backgroundColor: "#007bff",
        padding: 8,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#fff",
    },
});
