import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleScan = ({ data }) => {
    Alert.alert("สแกนสำเร็จ", `QR Code: ${data}`);
    navigation.navigate("Checkin", { cid: data }); // ส่งข้อมูลไปหน้า Checkin
  };

  if (!permission) {
    return (
      <View style={styles.messageContainer}>
        <Text>กำลังขอสิทธิ์ใช้งานกล้อง...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.messageContainer}>
        <Text>ไม่สามารถเข้าถึงกล้องได้</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barCodeTypes: ["qr"] }} // รองรับ QR Code
        onBarcodeScanned={handleScan} // แสกน QR Code อัตโนมัติ
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  messageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
