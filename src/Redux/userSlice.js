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
  getUserAllTrainingDays,
} from '../database/Database'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

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
      if (userAllTrainingsDataSnap !== null) {
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
          (userTrainingData) => userTrainingData.primary === true,
        )
        if (userTrainingPrimaryData) {
          const dayData = userTrainingPrimaryData?.days.find(
            (day) => day.day === moment(new Date()).format('d'),
          )

          if (dayData.groups.length > 0) {
            const newDayData = JSON.parse(JSON.stringify(dayData))
            newDayData.date = moment(new Date()).format('YYYY-MM-DD')
            newDayData.trainingName = userTrainingPrimaryData.trainingName
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
            await newUserTrainingDay(email, newDayData)
            const newUserTrainingDayDataSnap = await getUserTrainingDay(email)
            dispatch(setUserTrainingDayData(newUserTrainingDayDataSnap))
          }
        } else {
          // No hay training marcado como primario
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const saveUserTrainingDayData = (email, newUserTrainingDayData) => {
  return async (dispatch) => {
    try {
      dispatch(setUserTrainingDayData(newUserTrainingDayData))
      await setUserTrainingDay(email, newUserTrainingDayData)
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchUserAllTrainingDaysData = (email) => {
  return async (dispatch, getState) => {
    try {
      const userAllTrainingDaysDataSnap = await getUserAllTrainingDays(email)
      if (userAllTrainingDaysDataSnap !== null) {
        dispatch(setUserAllTrainingDaysData(userAllTrainingDaysDataSnap))
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
      const userData = JSON.parse(JSON.stringify(state.user.userData))
      const userTrainingDayData = JSON.parse(JSON.stringify(state.user.userTrainingDayData))
      const userAllTrainingDaysData = state.user.userAllTrainingDaysData

      const increaseXp = (amount) => {
        userData.userXp = (userData.userXp || 0) + amount
        userTrainingDayData.xpObtained = (userTrainingDayData.xpObtained || 0) + amount
      }

      const setDetails =
        userTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets[setIndex].details
      const { reps, weight } = setDetails

      setDetails.done = true

      userTrainingDayData.dayStats.totalSetsNumber += 1
      userTrainingDayData.dayStats.totalRepsNumber += reps
      userTrainingDayData.dayStats.totalWeightNumber += reps * weight

      userData.userStats.userTotalSetsNumber += 1
      userData.userStats.userTotalRepsNumber += reps
      userData.userStats.userTotalWeightNumber += reps * weight

      increaseXp(20)

      const exercise = userTrainingDayData.groups[groupIndex].exercises[exerciseIndex]
      if (exercise.sets.every((set) => set.details.done)) {
        exercise.done = true
        userTrainingDayData.dayStats.totalExercisesNumber += 1
        userData.userStats.userTotalExercisesNumber += 1

        // Obtener el nombre del grupo del ejercicio
        const groupName = userTrainingDayData.groups[groupIndex].groupName

        // Crear la propiedad dinámica en userStats
        const statKey = `exercisesNumber${groupName}`

        // Inicializar la propiedad si no existe
        if (!userData.userStats[statKey]) {
          userData.userStats[statKey] = 0
        }

        // Incrementar el contador del grupo específico
        userData.userStats[statKey] += 1

        increaseXp(15)
      }

      const allExercisesDone = userTrainingDayData.groups.every((group) =>
        group.exercises.every((exercise) => exercise.sets.every((set) => set.details.done)),
      )
      if (allExercisesDone) {
        userTrainingDayData.done = true
        userTrainingDayData.timeEnded = new Date().getTime()
        const totalTime =
          userTrainingDayData.timeEnded - (userTrainingDayData.timeStarted || new Date().getTime())

        userTrainingDayData.dayStats.totalTrainingTime = totalTime
        userData.userStats.userTotalTrainingTime += totalTime

        let trainingsFinished = 0
        let trainingsNotFinished = 0

        userAllTrainingDaysData.forEach((day) => {
          if (day.done) {
            trainingsFinished += 1
          } else if (!day.done) {
            trainingsNotFinished += 1
          }
        })

        userData.userStats.trainingsFinished = trainingsFinished
        userData.userStats.trainingsNotFinished = trainingsNotFinished

        increaseXp(150)
      }

      if (!userTrainingDayData.timeStarted) {
        userTrainingDayData.timeStarted = new Date().getTime()
      }

      dispatch(saveUserData(email, userData))
      dispatch(saveUserTrainingDayData(email, userTrainingDayData))
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

export const saveBodyWeightValueProgress = (email, bodyWeight) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userData = state.user.userData
      const newUserData = JSON.parse(JSON.stringify(userData))
      newUserData.userProgress.bodyWeightProgress[moment(new Date()).format('YYYY-MM-DD')] = {
        date: moment(new Date()).format('YYYY-MM-DD'),
        bodyWeight: bodyWeight,
      }
      dispatch(saveUserData(email, newUserData))
    } catch (error) {
      console.error(error)
    }
  }
}

export const newPersonalRecord = (email, exercise, reps) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const userData = state.user.userData
      const newUserData = JSON.parse(JSON.stringify(userData))
      newUserData.userProgress.userPersonalRecords.push({
        exercise: exercise,
        reps: reps,
        marks: {},
      })

      dispatch(saveUserData(email, newUserData))
    } catch (error) {
      console.error(error)
    }
  }
}

export const markPersonalRecord = (email, exercise, mark) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const newUserData = JSON.parse(JSON.stringify(state.user.userData))
      newUserData.userProgress.userPersonalRecords.map((record) => {
        if (record.exercise.exerciseName === exercise.exerciseName) {
          record.marks[moment(new Date()).format('YYYY-MM-DD')] = {
            date: moment(new Date()).format('YYYY-MM-DD'),
            mark: mark,
          }
        }
      })
      dispatch(saveUserData(email, newUserData))
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
    userAllTrainingDaysData: null,
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
    setUserAllTrainingDaysData: (state, action) => {
      state.userAllTrainingDaysData = action.payload
    },
    logOutUser: (state) => {
      state.userData = null
      state.userAllTrainingsData = null
      state.userTrainingDayData = null
    },
  },
})

export const {
  setUserData,
  setUserAllTrainingsData,
  setUserTrainingDayData,
  setUserAllTrainingDaysData,
  logOutUser,
} = userSlice.actions
export const selectUserData = (state) => state.user.userData
export const selectUserAllTrainingsData = (state) => state.user.userAllTrainingsData
export const selectUserTrainingDayData = (state) => state.user.userTrainingDayData
export const selectUserAllTrainingDaysData = (state) => state.user.userAllTrainingDaysData
export default userSlice.reducer
