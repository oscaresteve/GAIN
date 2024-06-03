import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const ProfilePictureProgress = ({ profilePic, currentXp, targetXp, level, size = 120 }) => {
  const percentage = currentXp >= targetXp ? 100 : (currentXp / targetXp) * 100
  const progress = useSharedValue(0)
  const color = '#FF2400'

  useEffect(() => {
    progress.value = withTiming(percentage, { duration: 700 })
  }, [percentage])

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = (size - 20) * Math.PI * (1 - progress.value / 100)
    return {
      strokeDashoffset,
    }
  })

  return (
    <View className="justify-cente items-center m-4">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 20) / 2}
            stroke="#e6e6e6"
            strokeWidth="10"
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={(size - 20) / 2}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={(size - 20) * Math.PI}
            animatedProps={animatedProps}
          />
        </Svg>
        <Image
          source={{ uri: profilePic }}
          style={{
            width: size - 30,
            height: size - 30,
            borderRadius: (size - 30) / 2,
            top: 15,
            left: 15,
          }}
          className="absolute"
        />
        <View className="absolute bottom-0 w-full items-center">
          <View className="rounded-md bg-primary-1 p-1">
            <Text className="text-md font-rubik-bold dark:text-white">Level {level}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProfilePictureProgress
