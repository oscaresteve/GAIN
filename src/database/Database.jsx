// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = require("./firebaseConfig.json");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export const createUser = async (id, email, password) => {
  await setDoc(doc(database, "users", id), {
    email: email,
    password: password,
  });
  console.log(">>> USER CREATED");
};

export const getUser = async (id) => {
  const docRef = doc(database, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const readUsers = async () => {
  const snapshot = await getDocs(collection(database, "users"));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(">>> DATA READED");
  return data;
};

export const removeUser = async (userId) => {
  await deleteDoc(doc(database, "users", userId));
  console.log(">>> USER DELETED");
};
