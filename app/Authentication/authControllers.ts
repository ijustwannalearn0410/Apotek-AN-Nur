import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";



export const registerUser = async (email: string, password: string, phone: string, fullname: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const snapshot = await get(ref(db, "users/" + user.uid));
     if (!snapshot.exists()) {
      return {
        user,
        role: "unregistered",
      };
    }

    const userData = snapshot.val();

    return {
      user,
      role: userData.role, 
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};