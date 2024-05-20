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
    (userTrainingData) => userTrainingData.primary === true,
  )
  const nextDayIndex = +userTrainingDayData?.day === 6 ? 0 : +userTrainingDayData?.day + 1
  const tomorrowTrainingDayData = primaryTrainingData?.days.find((day) => +day.day === nextDayIndex)

  useEffect(() => {
    if (userData) {
      dispatch(fetchUserTrainingDayData(userData?.email))
      dispatch(fetchUserAllTrainingsData(userData?.email))
    }
  }, [userData])

  useEffect(() => {
    if (userTrainingDayData?.restDay) {
      setView(<RestDayTrainingView tomorrowTrainingDayData={tomorrowTrainingDayData} />)
    } else {
      if (userTrainingDayData?.done) {
        setView(
          <FinishTrainingView
            userData={userData}
            tomorrowTrainingDayData={tomorrowTrainingDayData}
            userTrainingDayData={userTrainingDayData}
          />,
        )
      } else if (userTrainingDayData?.timeStarted) {
        setView(<TrainingDayView userData={userData} userTrainingDayData={userTrainingDayData} />)
      } else {
        setView(<StartTrainingView userData={userData} userTrainingDayData={userTrainingDayData} />)
      }
    }
  }, [userTrainingDayData])

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      {view}
      <AppBar />
    </View>
  )
}
