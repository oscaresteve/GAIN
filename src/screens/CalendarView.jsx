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
              className="m-4 rounded-full border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2"
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
      }
    } else {
      color = 'gray'
      message = 'Rest Day'
    }

    return (
      <View className="flex-row items-center">
        <CustomIcon name="circle" size={10} color={color} />
        <Text className="ml-2 font-rubik-regular text-xl" style={{ color }}>
          {message}
        </Text>
      </View>
    )
  }

  const BodyWeightMark = () => {
    const bodyWeightProgress = userData.userProgress.bodyWeightProgress
    const bodyWeightMark = bodyWeightProgress[moment(currentDate).format('YYYY-MM-DD')]

    const bodyWeightData = Object.values(userData.userProgress.bodyWeightProgress)
      .map((mark) => {
        return {
          date: moment(mark.date).toISOString(),
          value: mark.bodyWeight,
        }
      })
      .sort((a, b) => moment(a.date).diff(moment(b.date)))

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
        <PressableView>
          <Pressable
            onPress={() => {
              navigation.navigate('ProgressView', {
                data: bodyWeightData,
                name: 'BodyWeight',
              })
            }}
          >
            <View className="m-1 rounded-xl border border-smoke-3 bg-smoke-2 p-2 dark:border-night-3 dark:bg-night-2">
              <View className="m-1">
                <Text className="font-rubik-regular text-xl dark:text-white">Body Weight</Text>
              </View>
              <Divider />
              <View className="m-1 flex-row items-center">
                <Text className="font-rubik-regular text-xl dark:text-white">
                  {bodyWeightMark.bodyWeight} Kg
                </Text>
                {difference !== null && difference !== 0 && (
                  <Text
                    className={`text-md ml-2 font-rubik-regular ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    (
                    {difference >= 0 ? (
                      <CustomIcon name={'trending-up'} size={15} color={'white'} />
                    ) : (
                      <CustomIcon name={'trending-down'} size={15} color={'white'} />
                    )}{' '}
                    {Math.abs(difference)})
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        </PressableView>
      )
    }
  }

  const PersonalRecordMark = ({ userPersonalRecord }) => {
    const personalRecordData = Object.values(userPersonalRecord.marks)
      .map((mark) => {
        return {
          date: moment(mark.date).toISOString(),
          value: mark.mark,
        }
      })
      .sort((a, b) => moment(a.date).diff(moment(b.date)))

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
        <PressableView>
          <Pressable
            onPress={() => {
              navigation.navigate('ProgressView', {
                data: personalRecordData,
                name: userPersonalRecord.exercise.exerciseName,
              })
            }}
          >
            <View className="m-1 rounded-xl border border-smoke-3 bg-smoke-2 p-2 dark:border-night-3 dark:bg-night-2">
              <View className="m-1">
                <Text className="font-rubik-regular text-xl dark:text-white">
                  {userPersonalRecord.exercise.exerciseName}
                </Text>
              </View>
              <Divider />
              <View className="m-1 flex-row items-center">
                <Text className="font-rubik-regular text-xl dark:text-white">
                  {personalRecordMark.mark} Kg
                </Text>
                {difference !== null && difference !== 0 && (
                  <Text
                    className={`text-md ml-2 font-rubik-regular ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    (
                    {difference >= 0 ? (
                      <CustomIcon name={'trending-up'} size={15} color={'white'} />
                    ) : (
                      <CustomIcon name={'trending-down'} size={15} color={'white'} />
                    )}{' '}
                    {Math.abs(difference)})
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        </PressableView>
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
          bottom: useBottomTabBarHeight(),
          right: 0,
        }}
      >
        <View
          className="mx-2 my-2 grow"
          style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
        >
          <Calendar
            onDayPress={handleDayPress}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            userTrainingDayData={userTrainingDayData}
            userAllTrainingDaysData={userAllTrainingDaysData}
          />

          <View className="mt-12">
            <Text className="font-rubik-regular text-4xl dark:text-white">
              {moment(currentDate).format('Do MMM YYYY')}
            </Text>

            <DayStatus />

            {currentDateData && (
              <PressableView>
                <Pressable
                  onPress={() =>
                    navigation.navigate('TrainingDayView', {
                      userTrainingDayData: currentDateData,
                    })
                  }
                  className="my-4 items-center justify-center rounded-xl border border-primary-1 p-2"
                >
                  <Text className="font-rubik-regular text-xl font-bold text-primary-1">
                    View Training
                  </Text>
                </Pressable>
              </PressableView>
            )}
            <View className="my-2 items-center">
              <Text className="font-rubik-regular text-xl dark:text-white">Day Progress</Text>
            </View>
            <Divider />
            <View className="m-2">
              <BodyWeightMark />
              {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
                <PersonalRecordMark key={index} userPersonalRecord={userPersonalRecord} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <ScrollToTop />
      <AppBar label={'Calendar'} />
    </View>
  )
}
