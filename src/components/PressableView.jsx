import { View, Text } from 'react-native'
import React from 'react'

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export default function PressableView({
  children,
  duration = 50,
  transform = 0.95,
  opacity = 0.8,
}) {
  const pressed = useSharedValue(false)

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true
    })
    .onFinalize(() => {
      pressed.value = false
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? transform : 1, { duration: duration }) }],
    opacity: withTiming(pressed.value ? opacity : 1, { duration: duration }),
  }))

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={animatedStyles}>{children}</Animated.View>
    </GestureDetector>
  )
}
