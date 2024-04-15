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
import { useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = require("./firebaseConfig.json");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export const logInUser = async (email, password) => {
  const docRef = doc(database, "users", email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (docSnap.data().password === password) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const registerUser = async (email, password) => {
  const docRef = doc(database, "users", email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return false;
  } else {
    await setDoc(doc(database, "users", email), {
      email: email,
      password: password,
    });
    return true;
  }
};

export const setUserInfo = async (email, name, lastName, dateBirth, gender) => {
  const docRef = doc(
    collection(database, "users", email, "userInfo"),
    "personalInfo"
  );
  await setDoc(docRef, {
    name: name,
    lastName: lastName,
    dateBirth: dateBirth,
    gender: gender,
  });
};

export const getUserTraining = async (email, training) => {
  const docRef = doc(
    collection(database, "users", email, "userTrainings"),
    training
  );
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return false;
  }
};

/* export const readUsers = async () => {
  const snapshot = await getDocs(collection(database, "users"));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(">>> DATA READED");
  return data;
}; */

/* export const removeUser = async (userId) => {
  await deleteDoc(doc(database, "users", userId));
  console.log(">>> USER DELETED");
}; */
