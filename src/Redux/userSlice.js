import { createSlice } from '@reduxjs/toolkit'
import {
  getUserData,
  getUserAllTrainings,
  getUserTrainingDay,
  newUserTrainingDay,
  deleteUserTraining,
  setUserTraining,
  setUserTrainingDay,
  updateUserData,
  setUserXp,
  setUserStats,
} from '../database/Database'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const fetchUserData = (email) => {
  return async (dispatch) => {
    try {
      const userDataSnap = await getUserData(email)
      if (userDataSnap !== false) {
        dispatch(setUserData(userDataSnap))
      } else {
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const saveUserData = (email, userData) => {
  return async (dispatch) => {
    try {
      await updateUserData(email, userData)
      dispatch(setUserData(userData))
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchUserAllTrainingsData = (email) => {
  return async (dispatch) => {
    try {
      const userAllTrainingsDataSnap = await getUserAllTrainings(email)
      if (userAllTrainingsDataSnap !== false) {
        dispatch(setUserAllTrainingsData(userAllTrainingsDataSnap))
      } else {
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchUserTrainingDayData = (email) => {
  return async (dispatch, getState) => {
    try {
      dispatch(fetchUserAllTrainingsData(email))
      const state = getState()
      const userAllTrainingsData = state.user.userAllTrainingsData
      const userTrainingDayDataSnap = await getUserTrainingDay(email)
      if (userTrainingDayDataSnap) {
        dispatch(setUserTrainingDayData(userTrainingDayDataSnap))
      } else {
        const userTrainingPrimaryData = userAllTrainingsData?.find(
          (userTrainingData) => userTrainingData.primary === true
        )
        if (userTrainingPrimaryData) {
          await newUserTrainingDay(email, userTrainingPrimaryData)
          const newUserTrainingDayDataSnap = await getUserTrainingDay(email)
          dispatch(setUserTrainingDayData(newUserTrainingDayDataSnap))
        } else {
          // No hay training marcado como primario
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const saveUserTrainingData = (email, userTrainingData) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userAllTrainingsData = state.user.userAllTrainingsData
      const newUserTrainingData = userTrainingData
      if (userAllTrainingsData.length === 0) {
        newUserTrainingData.primary = true
      }
      dispatch(fetchUserAllTrainingsData(email))
      await setUserTraining(email, newUserTrainingData)
    } catch (error) {
      console.error(error)
    }
  }
}

export const deleteUserTrainingData = (email, userTrainingName) => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserAllTrainingsData(email))
      await deleteUserTraining(email, userTrainingName)
    } catch (error) {
      console.error(error)
    }
  }
}

export const setSetDone = (email, groupIndex, exerciseIndex, setIndex) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userData = state.user.userData
      const newUserData = JSON.parse(JSON.stringify(userData))
      const newUserTrainingDayData = JSON.parse(JSON.stringify(state.user.userTrainingDayData))

      const reps =
        newUserTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets[setIndex].details
          .reps
      const weight =
        newUserTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets[setIndex].details
          .weight

      newUserTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets[
        setIndex
      ].details.done = true

      newUserTrainingDayData.dayStats.totalSetsNumber += 1
      newUserData.userStats.userTotalSetsNumber += 1
      newUserTrainingDayData.dayStats.totalRepsNumber += reps
      newUserData.userStats.userTotalRepsNumber += reps
      newUserTrainingDayData.dayStats.totalWeightNumber += reps * weight
      newUserData.userStats.userTotalWeightNumber += reps * weight

      if (
        newUserTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets.length - 1 ===
        setIndex
      ) {
        newUserTrainingDayData.groups[groupIndex].exercises[exerciseIndex].done = true

        newUserTrainingDayData.dayStats.totalExercisesNumber += 1
        newUserData.userStats.userTotalExercisesNumber += 1

        dispatch(incrementXp(email, 15))
        console.log('Exercise done!')
      }

      if (
        newUserTrainingDayData.groups.every((group) =>
          group.exercises.every((exercise) => exercise.sets.every((set) => set.details.done))
        )
      ) {
        newUserTrainingDayData.done = true

        newUserTrainingDayData.timeEnded = new Date().getTime()
        const totalTime = newUserTrainingDayData.timeEnded - newUserTrainingDayData.timeStarted

        newUserTrainingDayData.dayStats.totalTrainingTime = totalTime
        newUserData.userStats.userTotalTrainingTime += totalTime

        dispatch(incrementXp(email, 150))
        console.log('Day done!')
      }
      dispatch(saveUserData(email, newUserData))
      dispatch(setUserTrainingDayData(newUserTrainingDayData))
      await setUserTrainingDay(email, newUserTrainingDayData)
    } catch (error) {
      console.error(error)
    }
  }
}

export const startUserTrainingDay = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userData = state.user.userData
      const userTrainingDayData = state.user.userTrainingDayData
      const newUserTrainingDayData = JSON.parse(JSON.stringify(userTrainingDayData))
      newUserTrainingDayData.timeStarted = new Date().getTime()
      dispatch(setUserTrainingDayData(newUserTrainingDayData))
      await setUserTrainingDay(userData.email, newUserTrainingDayData)
    } catch (error) {
      console.error(error)
    }
  }
}

export const endUserTrainingDay = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userData = state.user.userData
      const userTrainingDayData = state.user.userTrainingDayData
      const newUserTrainingDayData = JSON.parse(JSON.stringify(userTrainingDayData))
      newUserTrainingDayData.timeEnded = new Date().getTime()
      dispatch(setUserTrainingDayData(newUserTrainingDayData))
      await setUserTrainingDay(userData.email, newUserTrainingDayData)
    } catch (error) {
      console.error(error)
    }
  }
}

export const setUserTrainingPrimary = (userTrainingName) => {
  // pasar email por parametro
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userData = state.user.userData
      const userAllTrainingsData = state.user.userAllTrainingsData
      const newUserAllTrainingsData = userAllTrainingsData.map((userTrainingData) => {
        if (userTrainingData.trainingName === userTrainingName) {
          return { ...userTrainingData, primary: true }
        } else {
          return { ...userTrainingData, primary: false }
        }
      })
      newUserAllTrainingsData.map((userTrainingData) => {
        dispatch(saveUserTrainingData(userData.email, userTrainingData))
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export const clearUserSession = () => {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem('userData')
      await AsyncStorage.removeItem('userAllTrainingsData')
      await AsyncStorage.removeItem('userTrainingDayData')

      dispatch(logOutUser())
    } catch (error) {
      console.error('Error clearing user session:', error)
    }
  }
}

export const incrementXp = (email, amount) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userData = state.user.userData
      const newUserData = JSON.parse(JSON.stringify(userData))
      if (newUserData.userXp) {
        newUserData.userXp = newUserData.userXp + amount
      } else {
        newUserData.userXp = amount
      }
      dispatch(setUserData(newUserData))
      await setUserXp(email, newUserData.userXp)
    } catch (error) {
      console.error(error)
    }
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    userAllTrainingsData: null,
    userTrainingDayData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setUserAllTrainingsData: (state, action) => {
      state.userAllTrainingsData = action.payload
    },
    setUserTrainingDayData: (state, action) => {
      state.userTrainingDayData = action.payload
    },
    logOutUser: (state) => {
      state.userData = null
      state.userAllTrainingsData = null
      state.userTrainingDayData = null
    },
  },
})

export const { setUserData, setUserAllTrainingsData, setUserTrainingDayData, logOutUser } =
  userSlice.actions
export const selectUserData = (state) => state.user.userData
export const selectUserAllTrainingsData = (state) => state.user.userAllTrainingsData
export const selectUserTrainingDayData = (state) => state.user.userTrainingDayData
export default userSlice.reducer
