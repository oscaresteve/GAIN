import { View, Text } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserTrainingDayData } from '../Redux/userSlice'

export default function FinishTrainingView() {
  const userTrainingDayData = useSelector(selectUserTrainingDayData)
  return (
    <View>
      <Text>FinishTrainingView</Text>
      <Text>Stats: </Text>
      <Text>Total exercises: {userTrainingDayData.dayStats.totalExercisesNumber}</Text>
      <Text>Total sets: {userTrainingDayData.dayStats.totalSetsNumber}</Text>
      <Text>Total reps: {userTrainingDayData.dayStats.totalRepsNumber}</Text>
      <Text>Total training Time: {userTrainingDayData.dayStats.totalTrainingTime}</Text>
      <Text>Total weight: {userTrainingDayData.dayStats.totalWeightNumber}</Text>
    </View>
  )
}
