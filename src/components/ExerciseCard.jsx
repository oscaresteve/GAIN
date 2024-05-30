import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import CustomIcon from './CustomIcon'
import PressableView from './PressableView'

export const ExerciseCard = ({ exercise, exerciseExists, onAdd, onInfo }) => {
  const [expanded, setExpanded] = useState(false)
  const height = useSharedValue(0)

  const animatedHeightStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value, {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
      }),
    }
  })

  const toggleExpand = () => {
    if (expanded) {
      height.value = 0
    } else {
      height.value = 65
    }
    setExpanded(!expanded)
  }

  return (
    <Pressable onPress={toggleExpand}>
      <View
        className={`m-2 rounded-xl bg-white p-4 ${
          exerciseExists ? 'bg-smoke-2 dark:bg-night-2' : 'bg-smoke-3 dark:bg-night-3'
        }`}
      >
        <View className="">
          <Text className="font-custom text-xl dark:text-white">{exercise.exerciseName}</Text>
          {expanded && !exerciseExists && (
            <Animated.View style={[animatedHeightStyle]}>
              <View className="my-2 flex-row">
                <View className="grow">
                  <PressableView>
                    <Pressable
                      onPress={() => onAdd()}
                      className="m-1 grow items-center justify-center rounded-xl bg-primary-1 p-2"
                    >
                      <Text className="font-custom text-xl text-smoke-2 dark:text-night-3">
                        ADD
                      </Text>
                    </Pressable>
                  </PressableView>
                </View>

                <PressableView>
                  <Pressable
                    onPress={() => onInfo()}
                    className="m-1 grow items-center justify-center rounded-xl border border-white p-2"
                  >
                    <CustomIcon name={'info'} size={20} color={'white'} />
                  </Pressable>
                </PressableView>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </Pressable>
  )
}
