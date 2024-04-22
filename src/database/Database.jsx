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
import moment from "moment";
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

export const getUserTraining = async (email, userTrainingName) => {
  try {
    const docRef = doc(
      collection(database, "users", email, "userTrainings"),
      userTrainingName
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserTraining = async (email, userTrainingName) => {
  try {
    const docRef = doc(
      collection(database, "users", email, "userTrainings"),
      userTrainingName
    );
    await deleteDoc(docRef);
  } catch (error) {
    console.error(error);
  }
};

export const getUserAllTrainings = async (email) => {
  try {
    const docsSnap = await getDocs(
      collection(database, "users", email, "userTrainings")
    );
    return docsSnap.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(error);
  }
};

export const setUserTraining = async (email, userTrainingData) => {
  const docRef = doc(
    collection(database, "users", email, "userTrainings"),
    userTrainingData.trainingName
  );
  await setDoc(docRef, userTrainingData);
  if ((await getDoc(docRef)).exists()) {
    return true;
  } else {
    return false;
  }
};

export const getUserTrainingDay = async (email) => {
  try {
    const docRef = doc(
      collection(database, "users", email, "userTrainingDay"),
      moment(new Date()).format("DD-MM-YYYY")
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const setUserTrainingDay = async (email, userTrainingDayData) => {
  try {
    const docRef = doc(
      collection(database, "users", email, "userTrainingDay"),
      moment(new Date()).format("DD-MM-YYYY")
    );
    await setDoc(docRef, userTrainingDayData);
  } catch (error) {
    console.error(error);
  }
};

export const newUserTrainingDay = async (email, userTrainingName) => {
  try {
    const userTrainingData = await getUserTraining(email, userTrainingName);
    if (userTrainingData !== false) {
      const docRef = doc(
        collection(database, "users", email, "userTrainingDay"),
        moment(new Date()).format("DD-MM-YYYY")
      );
      await setDoc(
        docRef,
        userTrainingData.days.find(
          (day) => day.dayName === moment(new Date()).format("dddd")
        )
      );
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getGainData = async () => {
  try {
    const docRef = doc(database, "gain", "gainData");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};
