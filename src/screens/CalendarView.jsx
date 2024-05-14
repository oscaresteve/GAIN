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

  useEffect(() => {
    dispatch(fetchUserAllTrainingDaysData(userData.email))
  }, [])

  return (
    <SafeAreaView>
      <Text>Calendar</Text>
      <Calendar />
      {/* <Text>{JSON.stringify(selectedDayData)}</Text>
      <Text>{JSON.stringify(userData.userProgress.bodyWeightProgress[selected])}</Text>
      {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
        <View key={index}>
          <Text>
            {userPersonalRecord.exercise.exerciseName}
            {JSON.stringify(userPersonalRecord.marks[selected])}
          </Text>
        </View>
      ))} */}
    </SafeAreaView>
  )
}
