import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react'
import moment from 'moment'
import AppBar from '../components/AppBar'
import { useAppBarHeight } from '../components/AppBar'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'
import LineGraph from '../components/LineGraph'
import Divider from '../components/Divider'

export default function ProgressView({ navigation, route }) {
  const { data, name } = route.params

  const [month, setMonth] = useState(new Date().getMonth())
  const startDate = moment().month(month).startOf('month').toDate()
  const endDate = moment().month(month).endOf('month').toDate()

  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY > 0 && !showScrollToTop) {
      setShowScrollToTop(true)
    } else if (offsetY === 0 && showScrollToTop) {
      setShowScrollToTop(false)
    }
  }

  const filteredData = data.filter((d) => {
    const date = new Date(d.date)
    return date >= startDate && date <= endDate
  })

  const ScrollToTop = () => {
    if (showScrollToTop) {
      return (
        <View className="absolute right-0" style={{ marginTop: useAppBarHeight() }}>
          <PressableView
            onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
          >
            <View className="m-2">
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
        <View className="grow px-2 pb-20" style={{ paddingTop: useAppBarHeight() }}>
          <View>
            <LineGraph
              data={data}
              width={370}
              height={300}
              lineWidth={4}
              yLines={8}
              onNextMonth={(month) => setMonth(month)}
              onPrevMonth={(month) => setMonth(month)}
            />
          </View>
          <View className="my-2 items-center">
            <Text className="font-rubik-regular text-2xl dark:text-white">
              Progreso en {moment().month(month).format('MMMM')}
            </Text>
          </View>
          <Divider />
          <View className="my-2 p-2">
            {filteredData.reverse().map((item, itemIndex) => {
              const previousItem = filteredData[itemIndex + 1]

              const difference = previousItem ? item.value - previousItem.value : null

              return (
                <View key={itemIndex} className="m-1 rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
                  <View className="m-1 flex-row">
                    <Text className="grow font-rubik-regular text-xl opacity-70 dark:text-white">
                      {moment(item.date).format('Do MMMM')}
                    </Text>
                    {(difference > 0 && (
                      <CustomIcon name={'trendingUp'} color="green" opacity={0.7} />
                    )) ||
                      (difference < 0 && (
                        <CustomIcon name={'trendingDown'} color="red" opacity={0.7} />
                      )) || <CustomIcon name={'equal'} opacity={0.7} />}
                  </View>
                  <Divider />
                  <View className="m-1 flex-row items-center">
                    <Text className="font-rubik-regular text-xl dark:text-white">
                      {item.value} Kg
                    </Text>
                    {difference !== null && difference !== 0 && (
                      <View className="">
                        <Text
                          className={`ml-2 font-rubik-regular text-lg ${difference >= 0 ? 'text-officeGreen' : 'text-vermillion'}`}
                        >
                          ({difference >= 0 ? '+' : '-'}
                          {Math.abs(difference)})
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
      <AppBar label={name} backButton={true} onBack={() => navigation.goBack()} />
      <ScrollToTop />
    </View>
  )
}
