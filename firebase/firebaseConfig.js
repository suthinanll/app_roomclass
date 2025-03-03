import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ เปลี่ยนเป็น Firestore

const firebaseConfig = {
  apiKey: "AIzaSyD3fKnhvyVNEWgE6lmgRtVsBZFSBjJdOOA",
  authDomain: "project-finalmbw.firebaseapp.com",
  projectId: "project-finalmbw",
  storageBucket: "project-finalmbw.firebasestorage.app",
  messagingSenderId: "742173296191",
  appId: "1:742173296191:web:91474e78e2c39275725a8a",
  measurementId: "G-MNXL2CMT5S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
