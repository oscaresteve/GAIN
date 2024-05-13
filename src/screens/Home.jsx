import { View, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import TrainingDayView from '../components/TrainingDayView'
import StartTrainingView from '../components/StartTrainingDayView'
import FinishTrainingView from '../components/FinishTrainingDayView'
import AppBar from '../components/AppBar'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectUserTrainingDayData,
  selectUserData,
  fetchUserTrainingDayData,
  fetchUserAllTrainingsData,
  selectUserAllTrainingsData,
} from '../Redux/userSlice'
import RestDayTrainingView from '../components/RestDayTrainingView'
export default function Home() {
  const dispatch = useDispatch()
  const userTrainingDayData = useSelector(selectUserTrainingDayData)
  const userAllTrainingsData = useSelector(selectUserAllTrainingsData)
  const userData = useSelector(selectUserData)
  const [view, setView] = useState(null)

  const primaryTrainingData = userAllTrainingsData?.find(
    (userTrainingData) => userTrainingData.primary === true
  )

  const nextDayIndex = +userTrainingDayData.day === 6 ? 0 : +userTrainingDayData.day + 1
  const tomorrowTrainingDayData = primaryTrainingData?.days.find((day) => +day.day === nextDayIndex)

  useEffect(() => {
    if (userData) {
      dispatch(fetchUserTrainingDayData(userData?.email))
      dispatch(fetchUserAllTrainingsData(userData?.email))
      console.log(tomorrowTrainingDayData)
    }
  }, [userData])

  useEffect(() => {
    if (userTrainingDayData?.restDay) {
      setView(<RestDayTrainingView tomorrowTrainingDayData={tomorrowTrainingDayData} />)
    } else {
      if (userTrainingDayData?.timeEnded) {
        setView(<FinishTrainingView tomorrowTrainingDayData={tomorrowTrainingDayData} />)
      } else if (userTrainingDayData?.timeStarted) {
        setView(<TrainingDayView />)
      } else {
        setView(<StartTrainingView />)
      }
    }
  }, [userTrainingDayData])

  return (
    <SafeAreaView className="flex-1">
      <AppBar />
      <View>{view}</View>
    </SafeAreaView>
  )
}
