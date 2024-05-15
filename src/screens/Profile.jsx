import { View, Text, SafeAreaView, Button, Image } from 'react-native'
import React from 'react'
import AppBar from '../components/AppBar'

import { useSelector, useDispatch } from 'react-redux'
import { selectUserData, incrementXp } from '../Redux/userSlice'

export default function Profile({ navigation }) {
  const userData = useSelector(selectUserData)
  const dispatch = useDispatch()

  return (
    <SafeAreaView>
      <AppBar />
      <Image source={{ uri: userData.profilePic }} className="w-48 h-48" />
      <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
      <Button title="Configuration" onPress={() => navigation.navigate('Configuration')} />
      <Text className="text-2xl font-bold">
        {userData?.name} {userData?.lastName}
      </Text>
      <Text>Experience Points: {userData.userXp}</Text>

      <Text>STATS: </Text>
      <Text>Total Exercises Number: {userData.userStats.userTotalExercisesNumber}</Text>
      <Text>Total Sets Number: {userData.userStats.userTotalSetsNumber}</Text>
      <Text>Total Reps Number: {userData.userStats.userTotalRepsNumber}</Text>
      <Text>Total Weight Number: {userData.userStats.userTotalWeightNumber}</Text>
      <Text>Total Training Time: {userData.userStats.userTotalTrainingTime}</Text>
    </SafeAreaView>
  )
}
