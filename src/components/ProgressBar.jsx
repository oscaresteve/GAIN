import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

export default function ProgressBar({ current, target, height = 5 }) {
  const percentage = current >= target ? 100 : (current / target) * 100
  const progress = useSharedValue(0)
  const color = percentage === 100 ? 'green' : 'gray'

  useEffect(() => {
    progress.value = withTiming(percentage, { duration: 300 })
  }, [percentage])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    }
  })

  return (
    <View style={[styles.backgroundBar, { height }]} className="bg-smoke-3 dark:bg-night-3">
      <Animated.View style={[styles.foregroundBar, animatedStyle, { backgroundColor: color }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundBar: {
    borderRadius: '100%',
    overflow: 'hidden',
  },
  foregroundBar: {
    height: '100%',
    borderRadius: '100%',
  },
})
