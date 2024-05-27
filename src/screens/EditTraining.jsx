import {
  View,
  Text,
  SafeAreaView,
  Button,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectGainData, fetchGainData } from '../Redux/gainSlice'
import { selectUserData, saveUserTrainingData } from '../Redux/userSlice'
import moment from 'moment'
import AppBar, { useAppBarHeight } from '../components/AppBar'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'
import DifficultyBar from '../components/DifficultyBar'

export default function EditTraining({ navigation, route }) {
  const dispatch = useDispatch()
  const gainData = useSelector(selectGainData)
  const userData = useSelector(selectUserData)

  const [userTrainingData, setUserTrainingData] = useState(
    JSON.parse(JSON.stringify(route.params.userTrainingData)),
  )

  const [selectExerciseModalShow, setSelectExerciseModalShow] = useState({
    visible: false,
    dayIndex: null,
    groupSelected: 'Bicep',
  })

  useEffect(() => {
    dispatch(fetchGainData())
  }, [])

  const handleAddExercise = (dayIndex, exercise) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      const existingGroup = newUserTrainingData.days[dayIndex].groups.find(
        (group) => group.groupName === exercise.groupName,
      )

      if (existingGroup) {
        existingGroup.exercises.push({
          exerciseName: exercise.exerciseName,
          sets: [{ setNumber: 1, details: { reps: 1, weight: 5, done: false } }],
          done: false,
        })
      } else {
        newUserTrainingData.days[dayIndex].groups.push({
          groupName: exercise.groupName,
          exercises: [
            {
              exerciseName: exercise.exerciseName,
              sets: [{ setNumber: 1, details: { reps: 1, weight: 5, done: false } }],
              done: false,
            },
          ],
        })
      }
      return newUserTrainingData
    })
  }

  const handleSetExerciseNotes = (text, dayIndex, groupIndex, exerciseIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].exerciseNotes =
        text
      return newUserTrainingData
    })
  }

  const handleAddSet = (dayIndex, groupIndex, exerciseIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingdata = { ...prevData }
      const sets =
        newUserTrainingdata.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets
      const lastSet = sets[sets.length - 1]

      if (lastSet.setNumber < 10) {
        newUserTrainingdata.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets.push({
          setNumber: lastSet.setNumber + 1,
          details: { ...lastSet.details },
        })
      }
      return newUserTrainingdata
    })
  }

  const handleDeleteExercise = (dayIndex, groupIndex, exerciseIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      if (newUserTrainingData.days[dayIndex].groups[groupIndex].exercises.length === 1) {
        newUserTrainingData.days[dayIndex].groups.splice(groupIndex, 1)
      } else {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises.splice(exerciseIndex, 1)
      }
      return newUserTrainingData
    })
  }

  const handleDeleteSet = (dayIndex, groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets.splice(
        setIndex,
        1,
      )
      newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets.forEach(
        (set, index) => {
          set.setNumber = index + 1
        },
      )
      return newUserTrainingData
    })
  }

  const handleIncrementReps = (dayIndex, groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.reps < 30
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.reps++
      }
      return newUserTrainingData
    })
  }

  const handleDecrementReps = (dayIndex, groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.reps > 1
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.reps--
      }
      return newUserTrainingData
    })
  }

  const handleIncrementWeight = (dayIndex, groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.weight < 300
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.weight += 5
      }
      return newUserTrainingData
    })
  }

  const handleDecrementWeight = (dayIndex, groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData }
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.weight > 5
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[exerciseIndex].sets[
          setIndex
        ].details.weight -= 5
      }
      return newUserTrainingData
    })
  }

  const handleSaveTraining = () => {
    dispatch(saveUserTrainingData(userData?.email, userTrainingData))
    navigation.navigate('MyTrainings')
  }

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
          <PressableView>
            <Pressable
              onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
              className="m-4 rounded-full border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2"
            >
              <CustomIcon name={'keyboard-double-arrow-up'} size={40} color={'white'} />
            </Pressable>
          </PressableView>
        </View>
      )
    }
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView ref={scrollViewRef} onScroll={handleScroll}>
        <View className="grow justify-center px-2 pb-20" style={{ paddingTop: useAppBarHeight() }}>
          <Button title="save" onPress={handleSaveTraining} />
          <View>
            {userTrainingData.days?.map((day, dayIndex) => (
              <View key={dayIndex} className="my-2">
                <Text className="font-custom text-4xl font-bold dark:text-white">
                  {moment(day.day, 'd').format('dddd')}
                </Text>
                {day.groups?.map((group, groupIndex) => (
                  <View key={groupIndex} className="my-2 border-l-2 border-l-primary-1">
                    <Text className="font-custom text-4xl font-bold dark:text-white">
                      {group.groupName}
                    </Text>
                    {group.exercises?.map((exercise, exerciseIndex) => (
                      <View key={exerciseIndex} className="mx-2">
                        <View className="my-2">
                          <PressableView>
                            <Pressable
                              onPress={() => {
                                navigation.navigate('ExerciseInfo', { exercise: exercise })
                              }}
                            >
                              <Text className="font-custom text-2xl dark:text-white">
                                {exercise.exerciseName}
                              </Text>
                            </Pressable>
                          </PressableView>
                          {exercise.exerciseNotes && (
                            <TextInput
                              value={exercise.exerciseNotes}
                              placeholder="Add exercise Notes"
                              onChangeText={(text) =>
                                handleSetExerciseNotes(text, dayIndex, groupIndex, exerciseIndex)
                              }
                              className="font-custom text-xl opacity-50 dark:text-white"
                            />
                          )}
                        </View>
                        <Divider />
                        {exercise.sets?.map((set, setIndex) => (
                          <View key={setIndex}>
                            <View className="my-1 flex-row rounded-xl border border-smoke-2 bg-smoke-2 py-2 shadow-sm dark:border-night-3 dark:bg-night-2">
                              <View className="w-12 items-center justify-center">
                                <Text className="text-md font-custom dark:text-white">
                                  {set.setNumber}
                                </Text>
                              </View>
                              <Divider direction="vertical" />
                              <View className="mx-4 grow flex-row">
                                <View className="flex-1 items-center justify-center">
                                  <PressableView>
                                    <Pressable
                                      onPress={() =>
                                        handleIncrementReps(
                                          dayIndex,
                                          groupIndex,
                                          exerciseIndex,
                                          setIndex,
                                        )
                                      }
                                    >
                                      <CustomIcon
                                        name="keyboard-arrow-up"
                                        size={40}
                                        color={'white'}
                                      />
                                    </Pressable>
                                  </PressableView>
                                  <Text className="font-custom text-lg dark:text-white">
                                    {set.details.reps} reps
                                  </Text>
                                  <DifficultyBar value={set.details.reps} maxValue={12} />
                                  <PressableView>
                                    <Pressable
                                      onPress={() =>
                                        handleDecrementReps(
                                          dayIndex,
                                          groupIndex,
                                          exerciseIndex,
                                          setIndex,
                                        )
                                      }
                                    >
                                      <CustomIcon
                                        name="keyboard-arrow-down"
                                        size={40}
                                        color={'white'}
                                      />
                                    </Pressable>
                                  </PressableView>
                                </View>

                                <View className="flex-1 items-center justify-center">
                                  <Divider />
                                </View>

                                <View className="flex-1 items-center justify-center">
                                  <PressableView>
                                    <Pressable
                                      onPress={() =>
                                        handleIncrementWeight(
                                          dayIndex,
                                          groupIndex,
                                          exerciseIndex,
                                          setIndex,
                                        )
                                      }
                                    >
                                      <CustomIcon
                                        name="keyboard-arrow-up"
                                        size={40}
                                        color={'white'}
                                      />
                                    </Pressable>
                                  </PressableView>
                                  <Text className="font-custom text-lg dark:text-white">
                                    {set.details.weight} kg
                                  </Text>
                                  <DifficultyBar value={set.details.weight} maxValue={100} />
                                  <PressableView>
                                    <Pressable
                                      onPress={() =>
                                        handleDecrementWeight(
                                          dayIndex,
                                          groupIndex,
                                          exerciseIndex,
                                          setIndex,
                                        )
                                      }
                                    >
                                      <CustomIcon
                                        name="keyboard-arrow-down"
                                        size={40}
                                        color={'white'}
                                      />
                                    </Pressable>
                                  </PressableView>
                                </View>
                                <View className="items-center justify-center">
                                  <PressableView>
                                    <Pressable
                                      onPress={() =>
                                        handleDeleteSet(
                                          dayIndex,
                                          groupIndex,
                                          exerciseIndex,
                                          setIndex,
                                        )
                                      }
                                      disabled={exercise.sets.length === 1}
                                    >
                                      <CustomIcon name="delete" size={30} color={'white'} />
                                    </Pressable>
                                  </PressableView>
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}

                        <PressableView>
                          <Pressable
                            onPress={() => handleAddSet(dayIndex, groupIndex, exerciseIndex)}
                            className="my-1 flex-row rounded-xl border border-smoke-2 bg-smoke-2 py-2 shadow-sm dark:border-night-3 dark:bg-night-2"
                          >
                            <View className="w-12 items-center justify-center">
                              <Text className="text-md font-custom dark:text-white">
                                {exercise.sets.length + 1}
                              </Text>
                            </View>
                            <Divider direction="vertical" />
                            <View className="mx-4 grow flex-row items-center justify-center">
                              <CustomIcon name="add" size={60} color={'white'} />
                            </View>
                          </Pressable>
                        </PressableView>
                        <PressableView>
                          <Pressable
                            onPress={() =>
                              handleDeleteExercise(dayIndex, groupIndex, exerciseIndex)
                            }
                          >
                            <Text className="font-custom text-xl dark:text-white">
                              Delete Exercise
                            </Text>
                          </Pressable>
                        </PressableView>
                      </View>
                    ))}
                  </View>
                ))}
                <PressableView>
                  <Pressable
                    onPress={() =>
                      setSelectExerciseModalShow({
                        ...selectExerciseModalShow,
                        visible: true,
                        dayIndex: dayIndex,
                      })
                    }
                  >
                    <Text className="font-custom text-xl dark:text-white">Add Exercise</Text>
                  </Pressable>
                </PressableView>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={selectExerciseModalShow.visible}
                  onRequestClose={() =>
                    setSelectExerciseModalShow({
                      ...selectExerciseModalShow,
                      visible: false,
                    })
                  }
                >
                  <ScrollView>
                    <View className="mt-16 rounded-3xl bg-gray-200 p-2">
                      <Button
                        title="Close"
                        onPress={() =>
                          setSelectExerciseModalShow({
                            ...selectExerciseModalShow,
                            visible: false,
                          })
                        }
                      />

                      <Pressable
                        onPress={() =>
                          setSelectExerciseModalShow({
                            ...selectExerciseModalShow,
                            groupSelected: 'Bicep',
                          })
                        }
                      >
                        <Text className="text-3xl font-bold">Bicep</Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          setSelectExerciseModalShow({
                            ...selectExerciseModalShow,
                            groupSelected: 'Chest',
                          })
                        }
                      >
                        <Text className="text-3xl font-bold">Chest</Text>
                      </Pressable>
                      {gainData?.trainingExercises
                        ?.filter(
                          (exercise) =>
                            exercise.groupName === selectExerciseModalShow.groupSelected,
                        )
                        ?.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
                        .map((exercise, exerciseIndex) => {
                          const exerciseExists = userTrainingData.days[
                            selectExerciseModalShow.dayIndex
                          ]?.groups?.some((group) =>
                            group.exercises.some(
                              (existingExercise) =>
                                existingExercise.exerciseName === exercise.exerciseName,
                            ),
                          )
                          return (
                            <View
                              key={exerciseIndex}
                              className={`m-2 rounded-md bg-white p-2 shadow-sm ${
                                exerciseExists ? 'bg-gray-300' : 'bg-gray-100'
                              }`}
                            >
                              <Pressable
                                onPress={() => {
                                  if (!exerciseExists) {
                                    handleAddExercise(selectExerciseModalShow.dayIndex, exercise)
                                    setSelectExerciseModalShow({
                                      ...selectExerciseModalShow,
                                      visible: false,
                                    })
                                  }
                                }}
                                disabled={exerciseExists}
                              >
                                <Text className="text-2xl font-medium">
                                  {exercise.exerciseName}
                                </Text>
                              </Pressable>
                            </View>
                          )
                        })}
                    </View>
                  </ScrollView>
                </Modal>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <AppBar label={userTrainingData.trainingName} backButton={true} navigation={navigation} />
      <ScrollToTop />
    </View>
  )
}
