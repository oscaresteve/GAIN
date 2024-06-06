import { View, Text, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import AppBar from '../components/AppBar'
import { useAppBarHeight } from '../components/AppBar'
import CustomIcon from '../components/CustomIcon'
import PressableView from '../components/PressableView'
import Divider from '../components/Divider'
export default function ExerciseInfo({ navigation, route }) {
  const { exercise } = route.params

  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const parrafos = exercise.overview.split('. ').filter((parrafo) => parrafo.trim().length > 0)

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
          <View className="my-2">
            <Text className="my-2 font-rubik-regular text-4xl dark:text-white">
              {exercise.exerciseName}
            </Text>
          </View>
          <Divider height={4} />

          <View className="my-2 p-2">
            <Text className="my-2 font-rubik-regular text-3xl dark:text-white">Resumen:</Text>
            {parrafos.map((parrafo, index) => (
              <Text
                key={index}
                className="my-2 font-rubik-regular text-xl opacity-80 dark:text-white"
              >
                {parrafo}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <AppBar label={'Información'} backButton={true} onBack={() => navigation.goBack()} />
      <ScrollToTop />
    </View>
  )
}
