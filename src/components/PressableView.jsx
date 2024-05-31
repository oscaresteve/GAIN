import { Pressable, View } from 'react-native'
import React from 'react'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export default function PressableView({
  children,
  duration = 50,
  transform = 0.99,
  opacity = 0.7,
  onPress,
  disabled,
  haptic,
}) {
  const pressed = useSharedValue(false)

  const handleHaptics = () => {
    switch (haptic) {
      case 'Light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        break
      case 'Medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        break
      case 'Heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        break
      case 'Success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        break
      case 'Error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        break
      case 'Warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        break
      case 'None':
        break
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        break
    }
  }

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true
    })
    .onFinalize(() => {
      pressed.value = false
      runOnJS(handleHaptics)()
    })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? transform : 1, { duration: duration }) }],
    opacity: withTiming(pressed.value ? opacity : 1, { duration: duration }),
  }))

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={animatedStyles}>{children}</Animated.View>
      </GestureDetector>
    </Pressable>
  )
}
