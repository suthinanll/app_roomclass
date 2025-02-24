import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Card, Avatar, Button, IconButton, FAB } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } catch (error) {
        console.log("🔥 Error fetching user data:", error.message);
        Alert.alert("เกิดข้อผิดพลาด", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

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
            <IconButton
              icon="pencil"
              size={24}
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile")}
            />

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

          
          </Card>

          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => navigation.navigate("AddClass")}
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
  },
  profileCard: {
    width: "100%",
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: "white",
    position: "relative", // ทำให้ปุ่มแก้ไขอยู่ด้านบนของ Card
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
  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#ffff", // เปลี่ยนสีได้ตามต้องการ
  },
});
