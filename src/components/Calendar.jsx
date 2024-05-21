import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import moment from 'moment'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'
import CustomIcon from './CustomIcon'
import PressableView from './PressableView'
import Divider from './Divider'

export default Calendar = ({ onDayPress, onPrevMonth, onNextMonth, data }) => {
  const [currentDate, setCurrentDate] = useState(moment())

  const handleDayPress = (date) => {
    setCurrentDate(date)
    onDayPress(date)
  }

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'))
    onPrevMonth(currentDate.clone().subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'))
    onNextMonth(currentDate.clone().add(1, 'month'))
  }

  const renderCalendar = () => {
    const currentMonth = currentDate.month() + 1
    const currentYear = currentDate.year()
    const daysCount = moment(`${currentYear}-${currentMonth}`, 'YYYY-MM').daysInMonth()
    const startingDay = moment(`${currentYear}-${currentMonth}-01`, 'YYYY-MM-DD').day()
    let daysArray = []

    const getDateStatus = (date) => {
      const foundDay = data.find((item) => item.date === date.format('YYYY-MM-DD'))
      if (foundDay) {
        return foundDay?.restDay ? 'restDay' : foundDay?.done ? 'done' : 'notDone'
      }
    }

    const Day = ({ dayNumber = '', date, status, isSelected, buttonDisabled = false }) => {
      const getCurrentDay = () => {
        if (date && date.isSame(moment(), 'day')) {
          return 'border-2 border-smoke-3 dark:border-night-3'
        } else {
          return ''
        }
      }

      const getStatusDot = () => {
        if (status === 'done') return <CustomIcon name="circle" size={5} color={'green'} />
        if (status === 'notDone') return <CustomIcon name="circle" size={5} color={'red'} />
        if (status === 'restDay') return <CustomIcon name="circle" size={5} color={'blue'} />
        return <CustomIcon name="circle" size={10} color={'transparent'} />
      }

      const getIsSelected = () => {
        if (isSelected) return 'bg-smoke-3 dark:bg-night-3'
        return ''
      }

      return (
        <View className="w-[14.28%] p-2">
          <PressableView>
            <Pressable
              onPress={() => handleDayPress(date)}
              disabled={buttonDisabled}
              className={`aspect-square items-center justify-center rounded-xl ${getIsSelected()} ${getCurrentDay()}`}
            >
              <Text className="font-custom text-xl dark:text-white">{dayNumber}</Text>
            </Pressable>
          </PressableView>
          <View className="items-center p-1">{getStatusDot()}</View>
        </View>
      )
    }

    for (let i = 0; i < startingDay; i++) {
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

    const totalDays = startingDay + daysCount
    const remainingDays = 42 - totalDays

    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push(<Day key={`blank-end-${i}`} buttonDisabled={true}></Day>)
    }

    const swipeMonthGesture = Gesture.Pan()
      .minDistance(100)
      .onEnd((event) => {
        if (event.translationX < 0) {
          runOnJS(handleNextMonth)()
        } else if (event.translationX > 0) {
          runOnJS(handlePrevMonth)()
        }
      })

    return (
      <GestureDetector gesture={swipeMonthGesture}>
        <View className="rounded-3xl bg-smoke-2 p-2 dark:bg-night-2">
          <View className="my-2 flex-row items-center justify-between px-10">
            <PressableView>
              <Pressable onPress={handlePrevMonth}>
                <CustomIcon name={'navigate-before'} size={40} color={'black'} />
              </Pressable>
            </PressableView>
            <Text className="font-custom text-xl dark:text-white">
              {currentDate.format('MMMM')} {currentDate.format('YYYY')}
            </Text>
            <PressableView>
              <Pressable onPress={handleNextMonth}>
                <CustomIcon name={'navigate-next'} size={40} color={'black'} />
              </Pressable>
            </PressableView>
          </View>
          <Divider height={2} width="95%" />
          <View className="mt-2 flex-row">
            {moment.weekdaysShort().map((day, index) => (
              <View className="flex-1 items-center justify-center">
                <Text key={index} className="font-custon text-md dark:text-white">
                  {day}
                </Text>
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
