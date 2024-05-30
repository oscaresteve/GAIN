import { View, ScrollView, Pressable, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearUserSession } from '../Redux/userSlice'
import PressableView from '../components/PressableView'
import AppBar, { useAppBarHeight } from '../components/AppBar'
import CustomIcon from '../components/CustomIcon'

export default function Configuration({ navigation }) {
  const dispatch = useDispatch()
  const handleLogOut = () => {
    dispatch(clearUserSession())
    navigation.navigate('LogIn')
  }
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY > 0 && !showScrollToTop) {
      setShowScrollToTop(true)
    } else if (offsetY === 0 && showScrollToTop) {
      setShowScrollToTop(false)
    }
  }
  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const ScrollToTop = () => {
    if (showScrollToTop) {
      return (
        <View className="absolute right-0" style={{ marginTop: useAppBarHeight() }}>
          <PressableView>
            <Pressable
              onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
              className="m-4 rounded-full border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2"
            >
              <CustomIcon name={'keyboardDoubleArrowUp'} size={40} color={'white'} />
            </Pressable>
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
        <View className="mx-2 my-2 grow pb-20" style={{ paddingTop: useAppBarHeight() }}>
          <View className="my-2 items-center">
            <PressableView>
              <Pressable onPress={handleLogOut}>
                <Text className="font-rubik-regular text-2xl text-red-500">Log Out</Text>
              </Pressable>
            </PressableView>
          </View>
        </View>
      </ScrollView>
      <AppBar label={'Configuration'} backButton={true} navigation={navigation} />
      <ScrollToTop />
    </View>
  )
}
