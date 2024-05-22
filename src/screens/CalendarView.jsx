import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserAllTrainingDaysData } from '../Redux/userSlice'
import {
  selectUserData,
  selectUserTrainingDayData,
  selectUserAllTrainingDaysData,
} from '../Redux/userSlice'
import Calendar from '../components/Calendar'
import AppBar, { useAppBarHeight } from '../components/AppBar'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import CustomIcon from '../components/CustomIcon'
import Divider from '../components/Divider'
import PressableView from '../components/PressableView'

export default function CalendarView({ navigation }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const userAllTrainingDaysData = useSelector(selectUserAllTrainingDaysData)
  const userTrainingDayData = useSelector(selectUserTrainingDayData)
  const [currentDate, setCurrentDate] = useState(moment())
  const currentDateData =
    currentDate.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      ? userTrainingDayData
      : userAllTrainingDaysData.find(
          (trainingDayData) => moment(currentDate).format('YYYY-MM-DD') === trainingDayData.date,
        )
  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    dispatch(fetchUserAllTrainingDaysData(userData.email))
  }, [])

  const handleDayPress = (selectedDate) => {
    setCurrentDate(selectedDate)
    scrollViewRef.current.scrollTo({ x: 0, y: 500, animated: true })
  }

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'))
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
              className="m-4 rounded-full bg-smoke-2 dark:bg-night-2"
            >
              <CustomIcon name={'keyboard-double-arrow-up'} size={40} color={'white'} />
            </Pressable>
          </PressableView>
        </View>
      )
    }
  }

  const DayStatus = () => {
    const status = currentDateData?.restDay ? 'restDay' : currentDateData?.done ? 'done' : 'notDone'
    let color
    let message

    if (currentDateData) {
      if (status === 'done') {
        color = 'green'
        message = 'Training Finished'
      } else if (status === 'notDone') {
        color = 'red'
        message = 'Training Not Finished'
      } else if (status === 'restDay') {
        color = 'blue'
        message = 'Rest Day'
      } else {
        color = 'grey'
        message = 'No Training Day'
      }
    } else {
      color = 'gray'
      message = 'No Training Day'
    }

    return (
      <View className="flex-row items-center">
        <CustomIcon name="circle" size={10} color={color} />
        <Text className="ml-2 font-custom text-xl" style={{ color }}>
          {message}
        </Text>
      </View>
    )
  }

  const BodyWeightMark = () => {
    const bodyWeightProgress = userData.userProgress.bodyWeightProgress
    const bodyWeightMark = bodyWeightProgress[moment(currentDate).format('YYYY-MM-DD')]

    if (bodyWeightMark) {
      const sortedDates = Object.keys(bodyWeightProgress).sort((a, b) => moment(a).diff(moment(b)))
      const currentIndex = sortedDates.findIndex(
        (date) => date === moment(currentDate).format('YYYY-MM-DD'),
      )
      const previousBodyWeightMark = bodyWeightProgress[sortedDates[currentIndex - 1]]

      const difference = previousBodyWeightMark
        ? bodyWeightMark.bodyWeight - previousBodyWeightMark.bodyWeight
        : null

      return (
        <View className="m-1 rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
          <View className="m-1">
            <Text className="font-custom text-xl dark:text-white">Body Weight</Text>
          </View>
          <Divider height={2} width="100%" />
          <View className="m-1 flex-row items-center">
            <Text className="font-custom text-xl dark:text-white">
              {bodyWeightMark.bodyWeight} Kg
            </Text>
            {difference !== null && (
              <Text
                className={`text-md ml-2 font-custom ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                ({difference >= 0 ? '+' : '-'} {Math.abs(difference)})
              </Text>
            )}
          </View>
        </View>
      )
    }
  }

  const PersonalRecordMark = ({ userPersonalRecord }) => {
    const personalRecordMark = userPersonalRecord.marks[moment(currentDate).format('YYYY-MM-DD')]
    if (personalRecordMark) {
      const sortedDates = Object.keys(userPersonalRecord.marks).sort((a, b) =>
        moment(a).diff(moment(b)),
      )
      const currentIndex = sortedDates.findIndex(
        (date) => date === moment(currentDate).format('YYYY-MM-DD'),
      )
      const previousPersonalRecordMark = userPersonalRecord.marks[sortedDates[currentIndex - 1]]

      const difference = previousPersonalRecordMark
        ? personalRecordMark.mark - previousPersonalRecordMark.mark
        : null

      return (
        <View className="m-1 rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
          <View className="m-1">
            <Text className="font-custom text-xl dark:text-white">
              {userPersonalRecord.exercise.exerciseName}
            </Text>
          </View>
          <Divider height={2} width="100%" />
          <View className="m-1 flex-row items-center">
            <Text className="font-custom text-xl dark:text-white">
              {personalRecordMark.mark} Kg
            </Text>
            {difference !== null && (
              <Text
                className={`text-md ml-2 font-custom ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                ({difference >= 0 ? '+' : '-'} {Math.abs(difference)})
              </Text>
            )}
          </View>
        </View>
      )
    }
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView ref={scrollViewRef} onScroll={handleScroll}>
        <View
          className="mx-2 my-2 grow"
          style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
        >
          <ScrollView>
            <Calendar
              onDayPress={handleDayPress}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              userTrainingDayData={userTrainingDayData}
              userAllTrainingDaysData={userAllTrainingDaysData}
            />

            <View className="mt-12">
              <Text className="font-custom text-4xl dark:text-white">
                {moment(currentDate).format('Do MMM YYYY')}
              </Text>

              <DayStatus />

              {currentDateData && (
                <View>
                  <PressableView>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('TrainingDayView', {
                          userTrainingDayData: currentDateData,
                        })
                      }
                      className="my-4 items-center justify-center rounded-xl border border-primary-1 p-2"
                    >
                      <Text className="font-custom text-xl font-bold text-primary-1">
                        View Training
                      </Text>
                    </Pressable>
                  </PressableView>
                  <View className="my-2 items-center">
                    <Text className="font-custom text-xl dark:text-white">Day Progress</Text>
                  </View>
                  <Divider height={2} />

                  <View className="m-2">
                    <BodyWeightMark />
                    {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
                      <PersonalRecordMark key={index} userPersonalRecord={userPersonalRecord} />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <ScrollToTop />
      <AppBar label={'Calendar'} />
    </View>
  )
}
