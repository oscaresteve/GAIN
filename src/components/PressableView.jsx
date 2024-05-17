import { View, Text } from 'react-native'
import React from 'react'

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export default function PressableView(props) {
  const pressed = useSharedValue(false)

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true
    })
    .onFinalize(() => {
      pressed.value = false
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.95 : 1, { duration: 50 }) }],
  }))

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={animatedStyles}>{props.children}</Animated.View>
    </GestureDetector>
  )
}
