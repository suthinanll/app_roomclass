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
import { useFonts } from "expo-font";


export default function HomeScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]); // 🔹 เก็บข้อมูลคลาส

    // Load custom fonts
    const [fontsLoaded] = useFonts({
        "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
        "Prompt-Bold": require("../assets/fonts/Prompt-SemiBold.ttf"),
    });

    // Handle loading state for fonts
    if (!fontsLoaded) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

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
                    <Card style={styles.profileCard}>
                        {/* 🔹 ปุ่มแก้ไขข้อมูล */}
                        <TouchableOpacity onPress={() => navigation.navigate("Edit")} style={styles.editButtonContainer}>
                            <IconButton icon="pencil" size={20} />
                        </TouchableOpacity>

                        {/* 🔹 ส่วนโปรไฟล์ */}
                        <View style={styles.header}>
                            <Avatar.Image size={70} source={{ uri: userData.imgUrl }} />
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{userData.name}</Text>
                                <Text style={styles.userRole}>รหัสนักศึกษา: {userData.stdid}</Text>
                            </View>
                        </View>

                        {/* 🔹 ข้อมูลเพิ่มเติม */}
                        <View style={styles.details}>
                            <Text style={styles.infoText}>อีเมล : {userData.email}</Text>
                            <Text style={styles.infoText}>เบอร์โทรศัพท์ : {userData.phone}</Text>
                        </View>

                        {/* 🔹 ปุ่มต่างๆ */}
                        <View style={styles.buttonContainer}>

                            <Button mode="contained" onPress={handleLogout} style={styles.followButton}>
                                ออกจากระบบ
                            </Button>
                        </View>
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
    classTitle: {
        fontSize: 18, 
        fontWeight: "bold", 
        fontFamily: "Prompt-Bold",
        color: "#333", 
        marginBottom: 10, 
        textAlign: "left",
        paddingVertical: 5, 
        borderBottomWidth: 3, 
        borderBottomColor: "#007AFF",
        width: "100%", 
    },
    profileCard: {
        padding: 25,
        borderRadius: 15,
        margin: 10,
        backgroundColor: "white",
        elevation: 3,
    },
    editButtonContainer: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    userInfo: {
        marginLeft: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Prompt-Bold",

    },
    userRole: {
        fontSize: 14,
        color: "gray",
        fontFamily: "Prompt-Bold",

    },
    details: {
        marginVertical: 10,

    },
    infoText: {
        fontSize: 14,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    editButtonContainer: {
        position: "absolute", // จัดให้อยู่บนสุด
        top: -10, // ห่างจากขอบบน 10px
        right: -10, // ห่างจากขอบขวา 10px
        backgroundColor: "white", // ป้องกันพื้นหลังโปร่งใส
        borderRadius: 40, // ทำให้ปุ่มกลม
       
      },

    // 🟢 **Grid Layout**
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
        width: "48%", // แบ่งเป็น 2 คอลัมน์
        alignItems: "center",
    },
    photo: {
        width: "100%",
        height: 120,
        borderRadius: 8,
        marginBottom: 10,
    },
    className: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        fontFamily: "Prompt-Bold",
    },
    info: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        fontFamily: "Prompt-Regular",
    },
    button: {
        marginTop: 10,
        backgroundColor: "#28a745",
        padding: 8,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Prompt-Bold",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#fff",
    },
    followButton: {
        backgroundColor: "#FF3B30", 
        borderRadius: 20, 
        paddingVertical: 8, 
        paddingHorizontal: 8, 
        alignItems: "center", 
        justifyContent: "center",
        width: "100%", 
        marginTop: 15, 
       
    },
  
    
   
});

