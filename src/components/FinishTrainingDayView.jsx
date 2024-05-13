import { View, Text, Button } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectUserTrainingDayData,
  saveUserTrainingDayData,
  selectUserData,
} from '../Redux/userSlice'

export default function FinishTrainingView({ tomorrowTrainingDayData }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const userTrainingDayData = useSelector(selectUserTrainingDayData)

  const handleSetFeedback = (type, amount) => {
    const newUserTrainingDayData = JSON.parse(JSON.stringify(userTrainingDayData))
    newUserTrainingDayData.feedback[type] = amount
    dispatch(saveUserTrainingDayData(userData.email, newUserTrainingDayData))
  }

  const FeedbackView = () => {
    return (
      <View>
        <View>
          <Button title="motivation 1" onPress={() => handleSetFeedback('motivation', 1)} />
          <Button title="motivation 2" onPress={() => handleSetFeedback('motivation', 2)} />
          <Button title="motivation 3" onPress={() => handleSetFeedback('motivation', 3)} />
          <Button title="motivation 4" onPress={() => handleSetFeedback('motivation', 4)} />
          <Button title="motivation 5" onPress={() => handleSetFeedback('motivation', 5)} />
        </View>
        <View>
          <Button title="energy 1" onPress={() => handleSetFeedback('energy', 1)} />
          <Button title="energy 2" onPress={() => handleSetFeedback('energy', 2)} />
          <Button title="energy 3" onPress={() => handleSetFeedback('energy', 3)} />
          <Button title="energy 4" onPress={() => handleSetFeedback('energy', 4)} />
          <Button title="energy 5" onPress={() => handleSetFeedback('energy', 5)} />
        </View>
      </View>
    )
  }

  return (
    <View>
      <Text className="text-3xl">FinishTrainingView</Text>
      <Text className="text-2xl">Stats: </Text>
      <Text>Total exercises: {userTrainingDayData.dayStats.totalExercisesNumber}</Text>
      <Text>Total sets: {userTrainingDayData.dayStats.totalSetsNumber}</Text>
      <Text>Total reps: {userTrainingDayData.dayStats.totalRepsNumber}</Text>
      <Text>Total training Time: {userTrainingDayData.dayStats.totalTrainingTime}</Text>
      <Text>Total weight: {userTrainingDayData.dayStats.totalWeightNumber}</Text>
      <Text>Total xp obtained: {userTrainingDayData.xpObtained}</Text>
      <Text className="text-2xl">Tomorrow:</Text>
      <Text>{JSON.stringify(tomorrowTrainingDayData)}</Text>
      <FeedbackView />
      <Text>{JSON.stringify(userTrainingDayData.feedback)}</Text>
    </View>
  )
}
