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

  const [selectedDayIndex, setSelectedDayIndex] = useState('0')

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

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollIndicatorInsets={{
          top: useAppBarHeight(),
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        <View className="grow justify-center px-2 pb-20" style={{ paddingTop: useAppBarHeight() }}>
          <View className="my-2">
            <Text className="ml-2 font-rubik-regular text-3xl dark:text-white">
              {userTrainingData.trainingName}
            </Text>
          </View>
          <Divider />
          <View className="my-2">
            <View className="flex-row justify-around">
              {moment.weekdaysShort().map((weekday, index) => (
                <PressableView
                  key={index}
                  onPress={() => setSelectedDayIndex(moment(weekday, 'ddd').format('d'))}
                >
                  <View
                    className={`${selectedDayIndex === moment(weekday, 'ddd').format('d') && 'border-b-2 border-b-primary-1'}`}
                  >
                    <Text className="font-rubik-regular text-2xl dark:text-white">{weekday}</Text>
                  </View>
                </PressableView>
              ))}
            </View>
            {userTrainingData.days[selectedDayIndex].groups?.map((group, groupIndex) => (
              <View key={groupIndex} className="my-2 border-l-2 border-l-primary-1">
                <Text className="font-rubik-regular text-4xl font-bold dark:text-white">
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
                          {exercise.exerciseNotes}
                        </Text>
                      )}
                    </View>
                    <Divider />
                    <View className="my-2">
                      {exercise.sets?.map((set, setIndex) => (
                        <View key={setIndex}>
                          <View className="my-1 flex-row rounded-xl border border-smoke-2 bg-smoke-2 py-2 shadow-sm dark:border-night-3 dark:bg-night-2">
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
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View className="flex-row justify-around p-2">
            <PressableView onPress={handleDeleteTraining}>
              <Text className="font-rubik-regular text-xl dark:text-white">Delete</Text>
            </PressableView>
            <PressableView
              onPress={() => handleMakeTrainingPrimary(userTrainingData.trainingName)}
              disabled={userTrainingData.primary ? true : false}
            >
              <Text className="font-rubik-regular text-xl dark:text-white">Make primary</Text>
            </PressableView>
          </View>
        </View>
      </ScrollView>
      <AppBar
        label={'Training'}
        backButton={true}
        navigation={navigation}
        buttons={
          <PressableView onPress={handleEditTraining}>
            <Text className="font-rubik-regular text-2xl text-primary-1">Edit</Text>
          </PressableView>
        }
      />
      <ScrollToTop />
    </View>
  )
}
