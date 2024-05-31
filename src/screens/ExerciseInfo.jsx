import { View, Text, Pressable } from 'react-native'
import React from 'react'
import AppBar from '../components/AppBar'
import { useAppBarHeight } from '../components/AppBar'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'

export default function ExerciseInfo({ navigation, route }) {
  const { exercise } = route.params
  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <View className="grow px-2 pb-20" style={{ paddingTop: useAppBarHeight() }}>
        <Text className="font-rubik-regular text-2xl dark:text-white">{exercise.exerciseName}</Text>
      </View>
      <AppBar label={'Exercise Info'} backButton={true} navigation={navigation} />
    </View>
  )
}
