import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux'
import { startUserTrainingDay } from '../Redux/userSlice'
import PressableView from './PressableView'
import TrainingDayView from './TrainingDayView'
import { BlurView } from 'expo-blur'

export default function StartTrainingView({ userData, userTrainingDayData }) {
  const dispatch = useDispatch()
  const handleStartTrainingDay = () => {
    dispatch(startUserTrainingDay(userData.email))
  }
  console.log(JSON.stringify(userTrainingDayData))
  return (
    <View className="grow">
      <View className="absolute h-full w-full">
        <Pressable onPress={() => {}}>
          <TrainingDayView userData={userData} userTrainingDayData={userTrainingDayData} />
        </Pressable>
      </View>
      <BlurView className="grow justify-center" intensity={100}>
        {userTrainingDayData.groups.map((group, groupIndex) => (
          <View key={groupIndex} className="m-4">
            <Text className="font-custom text-xl text-opacity-80 dark:text-white">
              {group.groupName}
            </Text>
            {group.exercises.map((exercise, exerciseIndex) => {
              const setsCount = exercise.sets.length
              const repsCount = exercise.sets.map((set) => set.details.reps).join(', ')
              return (
                <View key={exerciseIndex} className="flex-row bg-red-300">
                  <Text className="flex-1 font-custom text-lg dark:text-white">
                    {exercise.exerciseName}
                  </Text>
                  <Text className="flex-1 font-custom text-lg dark:text-white">
                    {setsCount} x {repsCount}
                  </Text>
                </View>
              )
            })}
          </View>
        ))}
        <View className="mb-16 items-center">
          <PressableView>
            <Pressable
              onPress={handleStartTrainingDay}
              className="w-64 items-center justify-center rounded-full bg-primary-1 p-2"
            >
              <Text className="font-custom text-3xl font-bold text-smoke-1 dark:text-night-1">
                Start
              </Text>
            </Pressable>
          </PressableView>
        </View>
      </BlurView>
    </View>
  )
}
