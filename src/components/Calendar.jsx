import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import moment from 'moment'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import CustomIcon from './CustomIcon'
import PressableView from './PressableView'
import Divider from './Divider'

export default Calendar = ({
  onDayPress,
  onPrevMonth,
  onNextMonth,
  userTrainingDayData,
  userAllTrainingDaysData,
}) => {
  const [currentDate, setCurrentDate] = useState(moment())

  const handleDayPress = (date) => {
    setCurrentDate(date)
    onDayPress(date)
  }

  const handlePrevMonth = () => {
    const newDate = currentDate.clone().subtract(1, 'month')
    setCurrentDate(newDate)
    onPrevMonth(newDate)
  }

  const handleNextMonth = () => {
    const newDate = currentDate.clone().add(1, 'month')
    setCurrentDate(newDate)
    onNextMonth(newDate)
  }

  const renderCalendar = () => {
    const currentMonth = currentDate.month() + 1
    const currentYear = currentDate.year()
    const daysCount = moment(`${currentYear}-${currentMonth}`, 'YYYY-MM').daysInMonth()
    const startingDay = moment(`${currentYear}-${currentMonth}-01`, 'YYYY-MM-DD').day() - 1
    const adjustedStartingDay = startingDay === -1 ? 6 : startingDay
    let daysArray = []

    const getDateStatus = (date) => {
      const foundDay =
        date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
          ? userTrainingDayData
          : userAllTrainingDaysData.find((item) => item.date === date.format('YYYY-MM-DD'))
      if (foundDay) {
        return foundDay?.done ? 'done' : 'notDone'
      }
    }

    const Day = ({ dayNumber = '', date, status, isSelected, buttonDisabled = false }) => {
      const getIsCurrentDay = () => {
        if (date && date.isSame(moment(), 'day')) {
          return 'border-2 border-smoke-3 dark:border-night-3'
        } else {
          return ''
        }
      }

      const getIsSelected = () => {
        if (isSelected) return 'bg-smoke-3 dark:bg-night-3'
        return ''
      }

      const getStatusDot = () => {
        if (status === 'done') return <CustomIcon name="circleFILL" size={7} color={'green'} />
        if (status === 'notDone') return <CustomIcon name="circleFILL" size={7} color={'red'} />
        return <CustomIcon name="circleFILL" size={10} color={'transparent'} />
      }

      return (
        <View className="w-[14.28%] p-1">
          <PressableView onPress={() => handleDayPress(date)} disabled={buttonDisabled}>
            <View
              className={`aspect-square items-center justify-center rounded-xl ${getIsSelected()} ${getIsCurrentDay()}`}
            >
              <Text className="font-rubik-regular text-xl dark:text-white">{dayNumber}</Text>
            </View>
          </PressableView>
          <View className="items-center p-1">{getStatusDot()}</View>
        </View>
      )
    }

    for (let i = 0; i < adjustedStartingDay; i++) {
      daysArray.push(<Day key={`blank-start-${i}`} buttonDisabled={true}></Day>)
    }

    for (let i = 1; i <= daysCount; i++) {
      const date = moment(`${currentYear}-${currentMonth}-${i}`, 'YYYY-MM-DD')
      const dateStatus = getDateStatus(date)
      daysArray.push(
        <Day
          key={i}
          status={dateStatus}
          dayNumber={i}
          date={date}
          isSelected={date.isSame(currentDate, 'day')}
        ></Day>,
      )
    }

    const totalDays = adjustedStartingDay + daysCount
    const remainingDays = 42 - totalDays

    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push(<Day key={`blank-end-${i}`} buttonDisabled={true}></Day>)
    }

    const swipeMonthGesture = Gesture.Pan()
      .minDistance(50)
      .onEnd((event) => {
        if (event.translationX < 0) {
          runOnJS(handleNextMonth)()
        } else if (event.translationX > 0) {
          runOnJS(handlePrevMonth)()
        }
      })

    return (
      <GestureDetector gesture={swipeMonthGesture}>
        <View className="p-2">
          <View className="my-2 flex-row items-center justify-between px-10">
            <PressableView onPress={handlePrevMonth}>
              <CustomIcon name={'chevronBack'} size={40} color={'white'} opacity={0.7} />
            </PressableView>
            <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
              {currentDate.format('MMMM')} {currentDate.format('YYYY')}
            </Text>
            <PressableView onPress={handleNextMonth}>
              <CustomIcon name={'chevronForward'} size={40} color={'white'} opacity={0.7} />
            </PressableView>
          </View>
          <Divider />
          <View className="mt-2 flex-row">
            {moment.weekdaysShort().map((day, index) => (
              <View key={index} className="flex-1 items-center justify-center">
                <Text className="font-custon text-md opacity-70 dark:text-white">{day}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row flex-wrap">{daysArray}</View>
        </View>
      </GestureDetector>
    )
  }

  return <View>{renderCalendar()}</View>
}
