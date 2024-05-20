import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { setSetDone } from '../Redux/userSlice'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useAppBarHeight } from './AppBar'
import AnimatedSetCard from './AnimatedSetCard'
import Divider from './Divider'

export default function TrainingDayView({ userData, userTrainingDayData }) {
  const dispatch = useDispatch()

  const handleSetDone = (groupIndex, exerciseIndex, setIndex) => {
    dispatch(setSetDone(userData?.email, groupIndex, exerciseIndex, setIndex))
  }

  return (
    <ScrollView>
      <View
        className="mx-2 grow justify-center"
        style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
      >
        {userTrainingDayData?.groups?.map((group, groupIndex) => (
          <View key={groupIndex} className="my-2">
            <Text className="my-2 font-custom text-4xl font-bold dark:text-white">
              {group.groupName}
            </Text>
            {group.exercises?.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} className="mx-2">
                <Text className="font-custom text-2xl dark:text-white">
                  {exercise.exerciseName}
                </Text>
                <View className="my-2">
                  {exercise.sets?.map((set, setIndex) => {
                    const enabled =
                      !set.details.done &&
                      (setIndex === 0 || exercise.sets[setIndex - 1].details.done)
                    return (
                      <View key={setIndex}>
                        <AnimatedSetCard
                          enabled={enabled}
                          onSwipe={() => handleSetDone(groupIndex, exerciseIndex, setIndex)}
                        >
                          <View
                            className={`my-1 h-14 flex-row rounded-xl border-smoke-3 py-2 shadow-sm ${
                              set.details.done ? 'bg-green-300' : 'bg-smoke-2 dark:bg-night-2'
                            }`}
                          >
                            <View className="w-12 items-center justify-center">
                              <Text className="text-md font-custom dark:text-white">
                                {set.setNumber}
                              </Text>
                            </View>
                            <Divider direction="vertical" />
                            <View className="mx-4 grow flex-row">
                              <View className="flex-1 items-center justify-center">
                                <Text className="font-custom text-lg dark:text-white">
                                  {set.details.reps} reps
                                </Text>
                              </View>
                              <View className="flex-1 items-center justify-center">
                                <Divider />
                              </View>
                              <View className="flex-1 items-center justify-center">
                                <Text className="font-custom text-lg dark:text-white">
                                  {set.details.weight} kg
                                </Text>
                              </View>
                            </View>
                          </View>
                        </AnimatedSetCard>
                      </View>
                    )
                  })}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
