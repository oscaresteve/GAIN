// SelectExerciseModal.js

import React, { useState, useCallback } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Pressable } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import Divider from './Divider' // Assuming you have a Divider component
import ExerciseCard from './ExerciseCard' // Assuming you have an ExerciseCard component
import { useNavigation } from '@react-navigation/native' // If you are using react-navigation

const SelectExerciseModal = ({
  selectExerciseModalShow,
  setSelectExerciseModalShow,
  gainData,
  userTrainingData,
  handleAddExercise,
}) => {
  const navigation = useNavigation()
  const modalOpacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ translateY: withSpring(modalOpacity.value * 300, { damping: 15 }) }],
  }))

  const handleShowModal = useCallback(() => {
    modalOpacity.value = 1
  }, [])

  const handleCloseModal = useCallback(() => {
    modalOpacity.value = 0
    setTimeout(() => {
      setSelectExerciseModalShow({ ...selectExerciseModalShow, visible: false })
    }, 300) // Match the animation time of withSpring
  }, [setSelectExerciseModalShow, selectExerciseModalShow])

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        animatedStyle,
      ]}
    >
      <View className="mt-24 rounded-3xl bg-smoke-1 p-4 dark:bg-night-1">
        <Divider height={5} width={50} />
        <View className="my-4 flex-row flex-wrap justify-start ">
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {['Biceps', 'Triceps', 'Chest', 'Back', 'Legs', 'Shoulders'].map((group, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  setSelectExerciseModalShow({
                    ...selectExerciseModalShow,
                    groupSelected: group,
                  })
                }
              >
                <View
                  className={`mx-2 border-b-2 px-1 ${selectExerciseModalShow.groupSelected === group ? 'border-b-primary-1' : 'border-b-transparent'}`}
                >
                  <Text
                    className={`font-rubik-regular text-3xl opacity-70 dark:text-white ${selectExerciseModalShow.groupSelected === group && 'opacity-100'}`}
                  >
                    {group}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        {gainData?.trainingExercises
          ?.filter((exercise) => exercise.groupName === selectExerciseModalShow.groupSelected)
          ?.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
          .map((exercise, exerciseIndex) => {
            const exerciseExists = userTrainingData.days[
              selectExerciseModalShow.dayIndex
            ]?.groups?.some((group) =>
              group.exercises.some(
                (existingExercise) => existingExercise.exerciseName === exercise.exerciseName,
              ),
            )

            return (
              <ExerciseCard
                key={exerciseIndex}
                exercise={exercise}
                exerciseExists={exerciseExists}
                onAdd={() => {
                  handleAddExercise(selectExerciseModalShow.dayIndex, exercise)
                  setSelectExerciseModalShow({
                    ...selectExerciseModalShow,
                    visible: false,
                  })
                }}
                onInfo={() => {
                  navigation.navigate('ExerciseInfo', { exercise: exercise })
                  setSelectExerciseModalShow({
                    ...selectExerciseModalShow,
                    visible: false,
                  })
                }}
              />
            )
          })}
      </View>
    </Animated.View>
  )
}

export default SelectExerciseModal
