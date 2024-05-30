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
import { ExerciseCard } from '../components/ExerciseCard'

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

  const [selectedDayIndex, setSelectedDayIndex] = useState('0')

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

  const handleModalScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY < -150) {
      setSelectExerciseModalShow({
        ...selectExerciseModalShow,
        visible: false,
      })
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
              <CustomIcon name={'keyboardDoubleArrowUp'} size={40} color={'white'} />
            </Pressable>
          </PressableView>
        </View>
      )
    }
  }

  const AddButton = () => {
    return (
      <View className="absolute bottom-0 right-0 mb-10">
        <PressableView>
          <Pressable
            onPress={() =>
              setSelectExerciseModalShow({
                ...selectExerciseModalShow,
                visible: true,
                dayIndex: selectedDayIndex,
              })
            }
            className="m-4 h-16 w-16 items-center justify-center rounded-xl border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2"
          >
            <CustomIcon name={'add'} size={50} color={'white'} />
          </Pressable>
        </PressableView>
      </View>
    )
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollIndicatorInsets={{
          top: useAppBarHeight(),
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        <View className="grow justify-center px-2 pb-20" style={{ paddingTop: useAppBarHeight() }}>
          <View className="my-2">
            <Text className="ml-2 font-rubik-regular text-3xl dark:text-white">
              {userTrainingData.trainingName}
            </Text>
          </View>
          <Divider />
          <View calssName="my-2">
            <View className="flex-row justify-around">
              {moment.weekdaysShort().map((weekday, index) => (
                <PressableView key={index}>
                  <Pressable
                    onPress={() => setSelectedDayIndex(moment(weekday, 'ddd').format('d'))}
                    className={`${selectedDayIndex === moment(weekday, 'ddd').format('d') && 'border-b-2 border-b-primary-1'}`}
                  >
                    <Text className="font-rubik-regular text-2xl dark:text-white">{weekday}</Text>
                  </Pressable>
                </PressableView>
              ))}
            </View>
            {userTrainingData.days[selectedDayIndex].groups?.map((group, groupIndex) => (
              <View key={groupIndex} className="my-2 border-l-2 border-l-primary-1">
                <Text className="font-rubik-regular text-4xl font-bold dark:text-white">
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
                          <Text className="font-rubik-regular text-2xl dark:text-white">
                            {exercise.exerciseName}
                          </Text>
                        </Pressable>
                      </PressableView>
                      <TextInput
                        value={exercise.exerciseNotes}
                        placeholder="Add exercise Notes"
                        onChangeText={(text) =>
                          handleSetExerciseNotes(text, selectedDayIndex, groupIndex, exerciseIndex)
                        }
                        className="font-rubik-regular text-xl opacity-50 dark:text-white"
                      />
                    </View>
                    <Divider />
                    <View className="my-2">
                      {exercise.sets?.map((set, setIndex) => (
                        <View
                          key={setIndex}
                          className="my-1 flex-row rounded-xl border border-smoke-2 bg-smoke-2 py-2 shadow-sm dark:border-night-3 dark:bg-night-2"
                        >
                          <View className="w-12 items-center justify-center">
                            <Text className="text-md font-rubik-regular dark:text-white">
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
                                      selectedDayIndex,
                                      groupIndex,
                                      exerciseIndex,
                                      setIndex,
                                    )
                                  }
                                >
                                  <CustomIcon name="keyboardArrowUp" size={40} color={'white'} />
                                </Pressable>
                              </PressableView>
                              <Text className="font-rubik-regular text-lg dark:text-white">
                                {set.details.reps} reps
                              </Text>
                              <DifficultyBar value={set.details.reps} maxValue={12} />
                              <PressableView>
                                <Pressable
                                  onPress={() =>
                                    handleDecrementReps(
                                      selectedDayIndex,
                                      groupIndex,
                                      exerciseIndex,
                                      setIndex,
                                    )
                                  }
                                >
                                  <CustomIcon
                                    name="keyboardArrowDown"
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
                                      selectedDayIndex,
                                      groupIndex,
                                      exerciseIndex,
                                      setIndex,
                                    )
                                  }
                                >
                                  <CustomIcon name="keyboardArrowUp" size={40} color={'white'} />
                                </Pressable>
                              </PressableView>
                              <Text className="font-rubik-regular text-lg dark:text-white">
                                {set.details.weight} kg
                              </Text>
                              <DifficultyBar value={set.details.weight} maxValue={100} />
                              <PressableView>
                                <Pressable
                                  onPress={() =>
                                    handleDecrementWeight(
                                      selectedDayIndex,
                                      groupIndex,
                                      exerciseIndex,
                                      setIndex,
                                    )
                                  }
                                >
                                  <CustomIcon
                                    name="keyboardArrowDown"
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
                                      selectedDayIndex,
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
                      ))}
                      <PressableView>
                        <Pressable
                          onPress={() => handleAddSet(selectedDayIndex, groupIndex, exerciseIndex)}
                          className="my-1 flex-row rounded-xl border border-smoke-2 bg-smoke-2 py-2 shadow-sm dark:border-night-3 dark:bg-night-2"
                        >
                          <View className="w-12 items-center justify-center">
                            <Text className="text-md font-rubik-regular dark:text-white">
                              {exercise.sets.length + 1}
                            </Text>
                          </View>
                          <Divider direction="vertical" />
                          <View className="mx-4 grow flex-row items-center justify-center">
                            <CustomIcon name="add" size={60} color={'white'} />
                          </View>
                        </Pressable>
                      </PressableView>
                    </View>

                    <PressableView>
                      <Pressable
                        onPress={() =>
                          handleDeleteExercise(selectedDayIndex, groupIndex, exerciseIndex)
                        }
                        className="items-center"
                      >
                        <Text className="font-rubik-regular text-xl dark:text-white">Delete Exercise</Text>
                      </Pressable>
                    </PressableView>
                  </View>
                ))}
              </View>
            ))}

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
              <ScrollView onScroll={handleModalScroll} showsVerticalScrollIndicator={false}>
                <View className="mt-24 rounded-3xl bg-smoke-1 p-4 dark:bg-night-1">
                  <Divider height={4} width={50} />

                  <View className="my-4 flex-row flex-wrap justify-start ">
                    {['Bicep', 'Tricep', 'Chest', 'Back', 'Legs', 'Shoulder'].map(
                      (group, index) => (
                        <PressableView key={index}>
                          <Pressable
                            onPress={() =>
                              setSelectExerciseModalShow({
                                ...selectExerciseModalShow,
                                groupSelected: group,
                              })
                            }
                            className="m-1"
                          >
                            <Text className="font-rubik-regular text-3xl dark:text-white">{group}</Text>
                            <View
                              className={`mx-2 h-1.5 rounded-full ${selectExerciseModalShow.groupSelected === group ? 'bg-primary-1' : 'bg-transparent'}`}
                            ></View>
                          </Pressable>
                        </PressableView>
                      ),
                    )}
                  </View>
                  {gainData?.trainingExercises
                    ?.filter(
                      (exercise) => exercise.groupName === selectExerciseModalShow.groupSelected,
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
                        />
                      )
                    })}
                </View>
              </ScrollView>
            </Modal>
          </View>
        </View>
      </ScrollView>
      <AppBar
        label={'Edit Training'}
        backButton={true}
        navigation={navigation}
        buttons={
          <PressableView>
            <Pressable onPress={handleSaveTraining}>
              <Text className="font-rubik-regular text-2xl text-primary-1">Save</Text>
            </Pressable>
          </PressableView>
        }
      />
      <ScrollToTop />
      <AddButton />
    </View>
  )
}
