import { View, Text, ScrollView, Button, SafeAreaView, TextInput, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUserData, deleteUserTrainingData, setUserTrainingPrimary } from '../Redux/userSlice'
import moment from 'moment'
import DifficultyBar from '../components/DifficultyBar'
import AppBar, { useAppBarHeight } from '../components/AppBar'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CustomIcon from '../components/CustomIcon'
import PressableView from '../components/PressableView'
import Divider from '../components/Divider'

export default function Training({ navigation, route }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const { userTrainingData } = route.params

  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const handleDeleteTraining = () => {
    dispatch(deleteUserTrainingData(userData.email, userTrainingData.trainingName))
    navigation.goBack()
  }

  const handleMakeTrainingPrimary = (trainingName) => {
    dispatch(setUserTrainingPrimary(trainingName))
    navigation.goBack()
  }

  const handleEditTraining = () => {
    navigation.navigate('EditTraining', {
      userTrainingData: userTrainingData,
    })
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
          <PressableView>
            <Pressable
              onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
              className="m-4 rounded-full border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2"
            >
              <CustomIcon name={'keyboard-double-arrow-up'} size={40} color={'white'} />
            </Pressable>
          </PressableView>
        </View>
      )
    }
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView ref={scrollViewRef} onScroll={handleScroll}>
        <View className="grow justify-center px-2 pb-20" style={{ paddingTop: useAppBarHeight() }}>
          <Button title="Edit" onPress={handleEditTraining} />
          <Button
            title="Delete"
            onPress={handleDeleteTraining}
            disabled={userTrainingData.primary ? true : false}
          />
          <Button
            title="Make primary"
            onPress={() => handleMakeTrainingPrimary(userTrainingData.trainingName)}
            disabled={userTrainingData.primary ? true : false}
          />
          <View>
            {userTrainingData.days?.map(
              (day, dayIndex) =>
                day.groups.length > 0 && (
                  <View key={dayIndex} className="my-2">
                    <Text className="my-2 font-custom text-4xl font-bold dark:text-white">
                      {moment(day.day, 'd').format('dddd')}
                    </Text>

                    {day.groups?.map((group, groupIndex) => (
                      <View key={groupIndex} className="my-2 border-l-2 border-l-primary-1">
                        <Text className="font-custom text-4xl font-bold dark:text-white">
                          {group.groupName}
                        </Text>
                        {group.exercises?.map((exercise, exerciseIndex) => (
                          <View key={exerciseIndex} className="mx-2">
                            <View className="my-2">
                              <PressableView>
                                <Pressable
                                  onPress={() => {
                                    navigation.navigate('ExerciseInfo', { exercise: exercise })
                                  }}
                                >
                                  <Text className="font-custom text-2xl dark:text-white">
                                    {exercise.exerciseName}
                                  </Text>
                                </Pressable>
                              </PressableView>
                              {exercise.exerciseNotes && (
                                <Text className="font-custom text-xl opacity-50 dark:text-white">
                                  Note: {exercise.exerciseNotes}
                                </Text>
                              )}
                            </View>
                            <Divider />
                            <View className="my-2">
                              {exercise.sets?.map((set, setIndex) => (
                                <View key={setIndex}>
                                  <View className="my-1 flex-row rounded-xl border border-smoke-2 bg-smoke-2 py-2 shadow-sm dark:border-night-3 dark:bg-night-2">
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
                                        <DifficultyBar value={set.details.reps} maxValue={12} />
                                      </View>

                                      <View className="flex-1 items-center justify-center">
                                        <Divider />
                                      </View>

                                      <View className="flex-1 items-center justify-center">
                                        <Text className="font-custom text-lg dark:text-white">
                                          {set.details.weight} kg
                                        </Text>
                                        <DifficultyBar value={set.details.weight} maxValue={100} />
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              ))}
                            </View>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                ),
            )}
          </View>
        </View>
      </ScrollView>
      <AppBar label={userTrainingData.trainingName} backButton={true} navigation={navigation} />
      <ScrollToTop />
    </View>
  )
}
