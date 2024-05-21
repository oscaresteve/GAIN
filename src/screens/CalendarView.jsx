import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
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

export default function CalendarView() {
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

  useEffect(() => {
    dispatch(fetchUserAllTrainingDaysData(userData.email))
  }, [])

  const handleDayPress = (selectedDate) => {
    setCurrentDate(selectedDate)
    handleScroll()
  }

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'))
  }

  const handleScroll = () => {
    scrollViewRef.current.scrollTo({ x: 0, y: 500, animated: true })
  }

  const DayStatus = () => {
    const foundDay = userAllTrainingDaysData.find(
      (item) => item.date === currentDate.format('YYYY-MM-DD'),
    )

    const status = foundDay?.restDay ? 'restDay' : foundDay?.done ? 'done' : 'notDone'
    let color
    let message

    if (foundDay) {
      if (status === 'done') {
        color = 'green'
        message = 'Training Done'
      } else if (status === 'notDone') {
        color = 'red'
        message = 'Training Not Done'
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
        <CustomIcon name="circle" size={20} color={color} />
        <Text className="ml-2 font-custom text-2xl" style={{ color }}>
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
        <View className="flex-row items-center rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
          <Text className="font-custom text-xl dark:text-white">Body Weight: </Text>
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
      )
    }
    return null
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView ref={scrollViewRef}>
        <View
          className="mx-2 my-2 grow"
          style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
        >
          <ScrollView>
            <Calendar
              onDayPress={handleDayPress}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              data={userAllTrainingDaysData}
            />

            <View className="mt-5">
              <Text className="font-custom text-4xl dark:text-white">
                {moment(currentDate).format('Do MMM YYYY')}
              </Text>

              <DayStatus />

              <View className="mx-4">
                <Text className="my-2 font-custom text-2xl dark:text-white">Training Resume:</Text>
                <Divider height={3} />
                {currentDateData?.groups.map((group, groupIndex) => (
                  <View key={groupIndex} className="ml-2">
                    <Text className="my-1 font-custom text-xl dark:text-white">
                      {group.groupName}
                    </Text>
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
              <Text className="font-custom text-xl dark:text-white">Feedback:</Text>

              <BodyWeightMark />

              <Text className="font-custom text-xl dark:text-white">Records:</Text>
              {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
                <View key={index}>
                  <Text className="font-custom dark:text-white">
                    {userPersonalRecord.exercise.exerciseName}
                    {JSON.stringify(
                      userPersonalRecord.marks[moment(currentDate).format('YYYY-MM-DD')],
                    )}
                  </Text>
                </View>
              ))}

              <Text className="font-custom text-xl dark:text-white">Stats:</Text>
              <Text className="font-custom text-xl dark:text-white">
                {JSON.stringify(currentDateData)}
              </Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <AppBar />
    </View>
  )
}
