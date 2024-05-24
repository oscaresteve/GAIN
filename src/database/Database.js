// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { useState } from 'react'
import moment from 'moment'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = require('./firebaseConfig.json')

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getFirestore(app)

export const logInUser = async (email, password) => {
  try {
    const docRef = doc(database, 'users', email)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      if (docSnap.data().password === password) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

export const registerUser = async (email, password) => {
  try {
    const docRef = doc(database, 'users', email)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return false
    } else {
      await setDoc(doc(database, 'users', email), {
        email: email,
        password: password,
        name: null,
        lastName: null,
        dateBirth: null,
        gender: null,
        profilePic: null,
        userXp: null,
        userStats: {
          userTotalExercisesNumber: null,
          userTotalSetsNumber: null,
          userTotalRepsNumber: null,
          userTotalTrainingTime: null,
          userTotalWeightNumber: null,
        },
        userProgress: {
          bodyWeightProgress: [],
          userPersonalRecords: [],
        },
      })
      return true
    }
  } catch (error) {
    console.error(error)
  }
}

export const updateUserData = async (email, userData) => {
  try {
    const docRef = doc(database, 'users', email)
    await updateDoc(docRef, userData)
  } catch (error) {
    console.error(error)
  }
}

export const getUserData = async (email) => {
  try {
    const docRef = doc(database, 'users', email)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

export const getUserTraining = async (email, userTrainingName) => {
  try {
    const docRef = doc(collection(database, 'users', email, 'userTrainings'), userTrainingName)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

export const deleteUserTraining = async (email, userTrainingName) => {
  try {
    const docRef = doc(collection(database, 'users', email, 'userTrainings'), userTrainingName)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(error)
  }
}

export const getUserAllTrainings = async (email) => {
  try {
    const docsSnap = await getDocs(collection(database, 'users', email, 'userTrainings'))
    return docsSnap.docs.map((doc) => doc.data())
  } catch (error) {
    console.error(error)
  }
}

export const setUserTraining = async (email, userTrainingData) => {
  try {
    const docRef = doc(
      collection(database, 'users', email, 'userTrainings'),
      userTrainingData.trainingName,
    )
    await setDoc(docRef, userTrainingData)
    if ((await getDoc(docRef)).exists()) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

export const getUserTrainingDay = async (email) => {
  try {
    const docRef = doc(
      collection(database, 'users', email, 'userTrainingDays'),
      moment(new Date()).format('YYYY-MM-DD'),
    )
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return null
    }
  } catch (error) {
    console.error(error)
  }
}

export const setUserTrainingDay = async (email, userTrainingDayData) => {
  try {
    const docRef = doc(
      collection(database, 'users', email, 'userTrainingDays'),
      moment(new Date()).format('YYYY-MM-DD'),
    )
    await setDoc(docRef, userTrainingDayData)
  } catch (error) {
    console.error(error)
  }
}

export const newUserTrainingDay = async (email, userTrainingData) => {
  try {
    if (userTrainingData) {
      const docRef = doc(
        collection(database, 'users', email, 'userTrainingDays'),
        moment(new Date()).format('YYYY-MM-DD'),
      )
      const dayData = userTrainingData?.days.find(
        (day) => day.day === moment(new Date()).format('d'),
      )
      const newDayData = JSON.parse(JSON.stringify(dayData))
      newDayData.date = moment(new Date()).format('YYYY-MM-DD')
      newDayData.trainingName = userTrainingData.trainingName

      if (newDayData.groups.length > 0) {
        newDayData.done = false
        newDayData.timeStarted = false
        newDayData.timeEnded = false
        newDayData.dayStats = {
          totalTrainingTime: 0,
          totalExercisesNumber: 0,
          totalSetsNumber: 0,
          totalRepsNumber: 0,
          totalWeightNumber: 0,
        }
      }
      await setDoc(docRef, newDayData)
    }
  } catch (error) {
    console.error(error)
  }
}

export const getUserAllTrainingDays = async (email) => {
  try {
    const docsSnap = await getDocs(collection(database, 'users', email, 'userTrainingDays'))
    return docsSnap.docs.map((doc) => doc.data())
  } catch (error) {
    console.error(error)
  }
}

export const getGainData = async () => {
  try {
    const docRef = doc(database, 'gain', 'gainData')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

export const setUserXp = async (email, newXp) => {
  try {
    const docRef = doc(database, 'users', email)
    await updateDoc(docRef, { userXp: newXp })
  } catch (error) {
    console.error(error)
  }
}

export const setUserStats = async (email, userStats) => {
  try {
    const docRef = doc(database, 'users', email)
    await updateDoc(docRef, { userStats: userStats })
  } catch (error) {
    console.error(error)
  }
}
