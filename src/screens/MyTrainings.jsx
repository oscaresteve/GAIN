import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AppBar from '../components/AppBar'
import TrainingCard from '../components/TrainingCard'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectUserData,
  selectUserAllTrainingsData,
  fetchUserAllTrainingsData,
} from '../Redux/userSlice'
import { useAppBarHeight } from '../components/AppBar'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'
import MasonryList from '@react-native-seoul/masonry-list'

export default function MyTrainings({ navigation }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const userAllTrainingsData = useSelector(selectUserAllTrainingsData)
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
    return null
  }

  const AddButton = () => {
    return (
      <View className="absolute bottom-0 right-0" style={{ marginBottom: useBottomTabBarHeight() }}>
        <PressableView onPress={() => navigation.navigate('CreateTraining')}>
          <View className="m-4 h-16 w-16 items-center justify-center rounded-xl border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2">
            <CustomIcon name={'add'} size={50} color={'white'} />
          </View>
        </PressableView>
      </View>
    )
  }

  useEffect(() => {
    if (userData) {
      dispatch(fetchUserAllTrainingsData(userData?.email))
    }
  }, [userData])

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <MasonryList
        innerRef={scrollViewRef}
        onScroll={handleScroll}
        scrollIndicatorInsets={{
          top: useAppBarHeight(),
          left: 0,
          bottom: useBottomTabBarHeight(),
          right: 0,
        }}
        contentContainerStyle={{
          paddingBottom: useBottomTabBarHeight() + 8,
          paddingTop: useAppBarHeight() + 8,
          padding: 8,
        }}
        data={userAllTrainingsData}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TrainingCard key={index} userTrainingData={item} navigation={navigation} />
        )}
      />
      <ScrollToTop />
      <AddButton />
      <AppBar label={'Entrenamientos'} />
    </View>
  )
}
