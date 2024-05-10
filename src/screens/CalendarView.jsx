import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserAllTrainingDaysData } from '../Redux/userSlice'
import { selectUserData, selectUserAllTrainingDaysData } from '../Redux/userSlice'

export default function CalendarView() {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const userAllTrainingDaysData = useSelector(selectUserAllTrainingDaysData)

  useEffect(() => {
    dispatch(fetchUserAllTrainingDaysData(userData.email))
  }, [])

  const [selected, setSelected] = useState(moment(new Date()).format('YYYY-MM-DD'))
  const [selectedDayData, setSelectedDayData] = useState(
    userAllTrainingDaysData.find(
      (trainingDayData) => moment(new Date()).format('YYYY-MM-DD') === trainingDayData.date
    )
  )

  const markedDates = useMemo(() => {
    const marked = {}
    userAllTrainingDaysData.forEach((trainingDay) => {
      marked[trainingDay.date] = {
        marked: true,
        selectedColor: trainingDay.restDay ? 'blue' : trainingDay.done ? 'green' : 'red',
        dotColor: trainingDay.restDay ? 'blue' : trainingDay.done ? 'green' : 'red',
        selected: selected === trainingDay.date,
      }
    })

    // Verificar si selected está en marked
    if (!marked[selected]) {
      marked[selected] = {
        selected: true,
        selectedColor: 'gray',
      }
    }

    return marked
  }, [selected, userAllTrainingDaysData])

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString)
    setSelectedDayData(
      userAllTrainingDaysData.find((trainingDayData) => day.dateString === trainingDayData.date)
    )
  }, [])

  return (
    <SafeAreaView>
      <Text>Calendar</Text>
      <Calendar
        enableSwipeMonths
        current={selected}
        onDayPress={onDayPress}
        markedDates={markedDates}
        style={{ backgroundColor: 'transparent' }}
      />
      <Text>{JSON.stringify(selectedDayData)}</Text>
    </SafeAreaView>
  )
}
