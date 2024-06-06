import React, { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const ProfilePictureProgress = ({ profilePic, currentXp, targetXp, level, size = 120 }) => {
  const profilePicSource = profilePic ? { uri: profilePic } : require('../../assets/default-profile.png')

  const percentage = currentXp >= targetXp ? 100 : (currentXp / targetXp) * 100
  const progress = useSharedValue(0)
  const color = '#FF2400'
  const strokeWidth = 5

  useEffect(() => {
    progress.value = withTiming(percentage, { duration: 700 })
  }, [percentage])

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = (size - strokeWidth * 2) * Math.PI * (1 - progress.value / 100)
    return {
      strokeDashoffset,
    }
  })

  return (
    <View className="m-4 items-center justify-center">
      <View style={{ width: size, height: size }}>
        <Image
          source={profilePicSource}
          style={{
            width: size - strokeWidth,
            height: size - strokeWidth,
            borderRadius: (size - strokeWidth) / 2, // Ajuste de redondeo
            top: strokeWidth / 2,
            left: strokeWidth / 2,
          }}
          className="absolute"
        />
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth * 2) / 2}
            stroke="gray"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth * 2) / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={(size - strokeWidth * 2) * Math.PI}
            animatedProps={animatedProps}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View className="absolute bottom-0 w-full items-center">
          <View className="rounded-md bg-primary-1 p-1">
            <Text className="text-md font-rubik-bold text-white">Nivel {level}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProfilePictureProgress
