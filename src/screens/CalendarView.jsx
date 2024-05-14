import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserAllTrainingDaysData } from '../Redux/userSlice'
import { selectUserData, selectUserAllTrainingDaysData } from '../Redux/userSlice'
import Calendar from '../components/Calendar'

export default function CalendarView() {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const userAllTrainingDaysData = useSelector(selectUserAllTrainingDaysData)

  const [currentDate, setCurrentDate] = useState(moment())

  console.log(JSON.stringify(userAllTrainingDaysData))

  const handleDayPress = (selectedDate) => {
    setCurrentDate(selectedDate)
    console.log('Fecha seleccionada:', selectedDate)
    // Aquí puedes realizar cualquier otra acción con la fecha seleccionada
  }

  useEffect(() => {
    dispatch(fetchUserAllTrainingDaysData(userData.email))
  }, [])

  return (
    <SafeAreaView>
      <Text>Calendar</Text>
      <Calendar onDayPress={handleDayPress} data={userAllTrainingDaysData} />
      <Text>
        {JSON.stringify(
          userAllTrainingDaysData.find(
            (trainingDayData) => moment(currentDate).format('YYYY-MM-DD') === trainingDayData.date
          )
        )}
      </Text>
      <Text>
        {JSON.stringify(
          userData.userProgress.bodyWeightProgress[moment(currentDate).format('YYYY-MM-DD')]
        )}
      </Text>
      {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
        <View key={index}>
          <Text>
            {userPersonalRecord.exercise.exerciseName}
            {JSON.stringify(userPersonalRecord.marks[moment(currentDate).format('YYYY-MM-DD')])}
          </Text>
        </View>
      ))}
    </SafeAreaView>
  )
}
