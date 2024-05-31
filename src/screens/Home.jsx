import { View, Pressable, Button, ScrollView, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AppBar from '../components/AppBar'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectUserTrainingDayData,
  selectUserData,
  fetchUserTrainingDayData,
  fetchUserAllTrainingsData,
  saveUserTrainingDayData,
  setSetDone,
} from '../Redux/userSlice'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useAppBarHeight } from '../components/AppBar'
import AnimatedSetCard from '../components/AnimatedSetCard'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'
import DifficultyBar from '../components/DifficultyBar'

export default function Home({ navigation }) {
  const dispatch = useDispatch()
  const userTrainingDayData = useSelector(selectUserTrainingDayData)
  const userData = useSelector(selectUserData)

  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    if (userData) {
      dispatch(fetchUserTrainingDayData(userData?.email))
      dispatch(fetchUserAllTrainingsData(userData?.email))
    }
  }, [userData])

  const handleSetDone = (groupIndex, exerciseIndex, setIndex) => {
    dispatch(setSetDone(userData?.email, groupIndex, exerciseIndex, setIndex))
  }

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY > 0 && !showScrollToTop) {
      setShowScrollToTop(true)
    } else if (offsetY === 0 && showScrollToTop) {
      setShowScrollToTop(false)
    }
  }

  const ScrollToTop = () => {
    if (showScrollToTop) {
      return (
        <View className="absolute right-0" style={{ marginTop: useAppBarHeight() }}>
          <PressableView
            onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
          >
            <View className="m-4 rounded-full border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2">
              <CustomIcon name={'keyboardDoubleArrowUp'} size={40} color={'white'} />
            </View>
          </PressableView>
        </View>
      )
    }
  }

  const TrainingDay = () => {
    if (userTrainingDayData.groups.length > 0) {
      return (
        <View>
          {userTrainingDayData?.groups?.map((group, groupIndex) => (
            <View key={groupIndex} className="my-2 border-l-2 border-l-primary-1">
              <Text className="my-2 font-rubik-medium text-4xl dark:text-white">
                {group.groupName}
              </Text>
              {group.exercises?.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} className="mx-2">
                  <View className="my-2">
                    <PressableView
                      onPress={() => {
                        navigation.navigate('ExerciseInfo', { exercise: exercise })
                      }}
                    >
                      <Text className="font-rubik-regular text-2xl dark:text-white">
                        {exercise.exerciseName}
                      </Text>
                    </PressableView>
                    {exercise.exerciseNotes && (
                      <Text className="font-rubik-regular text-xl opacity-50 dark:text-white">
                        Note: {exercise.exerciseNotes}
                      </Text>
                    )}
                  </View>
                  <Divider />
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
                              className={`my-1 h-14 flex-row rounded-xl bg-smoke-2 py-2 shadow-sm dark:bg-night-2 
                              ${set.details.done && 'border-2 border-green-500'} ${enabled && 'border-2 border-smoke-3 dark:border-night-3'}`}
                            >
                              <View className="w-12 items-center justify-center">
                                <Text className="text-md font-rubik-regular dark:text-white">
                                  {set.setNumber}
                                </Text>
                              </View>
                              <Divider direction="vertical" />
                              <View className="mx-4 grow flex-row">
                                <View className="flex-1 items-center justify-center">
                                  <Text className="font-rubik-regular text-lg dark:text-white">
                                    {set.details.reps} reps
                                  </Text>
                                  <DifficultyBar value={set.details.reps} maxValue={12} />
                                </View>
                                <View className="flex-1 items-center justify-center">
                                  <Divider />
                                </View>
                                <View className="flex-1 items-center justify-center">
                                  <Text className="font-rubik-regular text-lg dark:text-white">
                                    {set.details.weight} kg
                                  </Text>
                                  <DifficultyBar value={set.details.weight} maxValue={100} />
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
          <TrainingStats />
        </View>
      )
    } else {
      return (
        <View>
          <Text className="font-rubik-regular text-3xl dark:text-white">REST DAY</Text>
        </View>
      )
    }
  }

  const TrainingStats = () => {
    const msToTime = (ms) => {
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((ms / (1000 * 60)) % 60)
      const seconds = Math.floor((ms / 1000) % 60)

      const hoursStr = hours > 0 ? ` ${hours}h` : ''
      const minutesStr = minutes > 0 ? ` ${minutes}m` : ''
      const secondsStr = ` ${seconds}s`

      return `${hoursStr}${minutesStr}${secondsStr}`
    }

    return (
      <View className="my-2">
        <View className="items-center">
          <Text className="my-2 font-rubik-medium text-2xl dark:text-white">Training Stats</Text>
        </View>

        <Divider />

        <View className="m-4">
          <View className="m-1 flex-row items-center justify-end">
            <Text className="font-rubik-regular text-xl dark:text-white">Exercises</Text>
            <View className="grow">
              <Divider height={1} width={'80%'} />
            </View>
            <Text className="font-rubik-regular text-xl dark:text-white">
              {userTrainingDayData.dayStats.totalExercisesNumber}
            </Text>
          </View>

          <View className="m-1 flex-row items-center justify-end">
            <Text className="font-rubik-regular text-xl dark:text-white">Sets</Text>
            <View className="grow">
              <Divider height={1} width={'80%'} />
            </View>
            <Text className="font-rubik-regular text-xl dark:text-white">
              {userTrainingDayData.dayStats.totalSetsNumber}
            </Text>
          </View>

          <View className="m-1 flex-row items-center justify-end">
            <Text className="font-rubik-regular text-xl dark:text-white">Reps</Text>
            <View className="grow">
              <Divider height={1} width={'80%'} />
            </View>
            <Text className="font-rubik-regular text-xl dark:text-white">
              {userTrainingDayData.dayStats.totalRepsNumber}
            </Text>
          </View>

          <View className="m-1 flex-row items-center justify-end">
            <Text className="font-rubik-regular text-xl dark:text-white">Weight lifted</Text>
            <View className="grow">
              <Divider height={1} width={'80%'} />
            </View>
            <Text className="font-rubik-regular text-xl dark:text-white">
              {userTrainingDayData.dayStats.totalWeightNumber} Kg
            </Text>
          </View>

          <View className="m-1 flex-row items-center justify-end">
            <Text className="font-rubik-regular text-xl dark:text-white">Training Time</Text>
            <View className="grow">
              <Divider height={1} width={'80%'} />
            </View>
            <Text className="font-rubik-regular text-xl dark:text-white">
              {userTrainingDayData.dayStats.totalTrainingTime
                ? msToTime(userTrainingDayData.dayStats.totalTrainingTime)
                : 'Not Finished'}
            </Text>
          </View>

          <View className="m-1 flex-row items-center justify-end">
            <Text className="font-rubik-regular text-xl dark:text-white">Xp obtained</Text>
            <View className="grow">
              <Divider height={1} width={'80%'} />
            </View>
            <Text className="font-rubik-regular text-xl dark:text-white">
              {userTrainingDayData.xpObtained} XP
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollIndicatorInsets={{
          top: useAppBarHeight(),
          left: 0,
          bottom: useBottomTabBarHeight(),
          right: 0,
        }}
      >
        <View
          className="grow justify-center px-2"
          style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
        >
          <TrainingDay />
        </View>
      </ScrollView>
      <ScrollToTop />
      <AppBar />
    </View>
  )
}
