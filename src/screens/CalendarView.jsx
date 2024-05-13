import { View, Text, SafeAreaView, Pressable } from 'react-native'
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

  const onDayPress = useCallback((date) => {
    setSelected(date.dateString)
    setSelectedDayData(
      userAllTrainingDaysData.find((trainingDayData) => date.dateString === trainingDayData.date)
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
        dayComponent={({ date }) => {
          const item = markedDates[date.dateString] || {}
          return (
            <Pressable onPress={() => onDayPress(date)}>
              <View className="border rounded-md h-12 w-12 bg-slate-200">
                <Text className="font-bold">{date.day}</Text>
              </View>
            </Pressable>
          )
        }}
      />
      <Text>{JSON.stringify(selectedDayData)}</Text>
      <Text>{JSON.stringify(userData.userProgress.bodyWeightProgress[selected])}</Text>
      {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
        <View key={index}>
          <Text>
            {userPersonalRecord.exercise.exerciseName}
            {JSON.stringify(userPersonalRecord.marks[selected])}
          </Text>
        </View>
      ))}
    </SafeAreaView>
  )
}
