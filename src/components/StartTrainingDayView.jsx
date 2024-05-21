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
        <View className="mx-4">
          <Text className="my-2 font-custom text-2xl dark:text-white">Training Resume:</Text>
          <Divider height={3} />
          {userTrainingDayData?.groups.map((group, groupIndex) => (
            <View key={groupIndex} className="ml-2">
              <Text className="my-1 font-custom text-xl dark:text-white">{group.groupName}</Text>
              <View className="mb-4">
                {group.exercises.map((exercise, exerciseIndex) => {
                  const setsCount = exercise.sets.length
                  const repsCount = exercise.sets.map((set) => set.details.reps).join(', ')
                  return (
                    <View key={exerciseIndex} className="ml-2">
                      <Text className="font-custom text-lg dark:text-white">
                        {exercise.exerciseName}
                      </Text>
                      <Text className="ml-2 font-custom text-lg dark:text-white">
                        {setsCount}
                        {' x '}
                        {repsCount}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </View>
          ))}
        </View>
        <View className="items-center">
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
