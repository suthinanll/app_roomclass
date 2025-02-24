import { useState, useEffect, useRef } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isProcessing = useRef(false); // ป้องกันการสแกนซ้ำ

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleScan = ({ data }) => {
    if (isProcessing.current) return; //  ถ้ากำลังประมวลผล ให้ข้ามไปเลย
    isProcessing.current = true; //  ล็อคการสแกน

    setScanned(true);
    console.log("✅ QR Code ที่สแกนได้:", data);

    Alert.alert("สแกนสำเร็จ", `QR Code: ${data}`, [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("Addclass", { cid: data });
          setTimeout(() => {
            isProcessing.current = false; // ปลดล็อคหลังจาก 2 วินาที
            setScanned(false); // รีเซ็ตสถานะให้สแกนใหม่ได้
          }, 2000);
        },
      },
    ]);
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
        <Text> ไม่สามารถเข้าถึงกล้องได้</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.scanAgainText}>สแกนอีกครั้ง</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  camera: { flex: 1 },
  messageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanAgainButton: {
    position: "absolute",
    bottom: 50,
    left: "25%",
    width: "50%",
    backgroundColor: "#008CBA",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  scanAgainText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
