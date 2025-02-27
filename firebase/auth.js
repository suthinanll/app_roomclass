import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const loginWithEmail = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};
