import { View, Text } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import CustomIcon from './CustomIcon'

export default function AnimatedSetCard({ children, onSwipe, enabled }) {
  const xPosition = useSharedValue(0)
  const fullGesture = useSharedValue(false)

  const swipeGesture = Gesture.Pan()
    .enabled(enabled)
    .minDistance(10)
    .onUpdate((event) => {
      xPosition.value = Math.min(Math.max(event.translationX, 0), 75)
      if (xPosition.value >= 75 && !fullGesture.value) {
        fullGesture.value = true
      } else if (xPosition.value < 75) {
        fullGesture.value = false
      }
    })
    .onEnd(() => {
      if (fullGesture.value) {
        runOnJS(onSwipe)()
      }
      xPosition.value = withTiming(0, { duration: 100, easing: Easing.out(Easing.cubic) })
      fullGesture.value = false
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: xPosition.value,
      },
    ],
  }))

  const animatedStyleViewUnder = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(xPosition.value, [0, 100], [0.99, 0.95]),
      },
    ],
  }))

  return (
    <GestureDetector gesture={swipeGesture}>
      <View>
        <Animated.View
          style={[animatedStyleViewUnder]}
          className="bg-officeGreen absolute my-1 h-14 w-full flex-row items-center justify-start rounded-xl pl-4"
        >
          <CustomIcon name={'checkCircle'} size={40} color={1} />
        </Animated.View>
        <Animated.View style={[animatedStyle]}>{children}</Animated.View>
      </View>
    </GestureDetector>
  )
}
