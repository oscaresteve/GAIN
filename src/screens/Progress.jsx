import {
  View,
  Text,
  SafeAreaView,
  Button,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  saveBodyWeightValueProgress,
  selectUserData,
  newPersonalRecord,
  markPersonalRecord,
} from '../Redux/userSlice'
import { selectGainData, fetchGainData } from '../Redux/gainSlice'
import moment from 'moment'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'
import AppBar from '../components/AppBar'
import { useAppBarHeight } from '../components/AppBar'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import Divider from '../components/Divider'
import LineGraph from '../components/LineGraph'
import KeyboardView from '../components/KeyboardView'
import { ExerciseCard } from '../components/ExerciseCard'

export default function Progress({ navigation }) {
  const userData = useSelector(selectUserData)
  const gainData = useSelector(selectGainData)
  const dispatch = useDispatch()
  const [bodyWeightValue, setBodyWeightValue] = useState(null)
  const [recordValues, setRecordValues] = useState([])
  const [selectExerciseModalShow, setSelectExerciseModalShow] = useState({
    visible: false,
    groupSelected: 'Bicep',
  })

  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    dispatch(fetchGainData())
  }, [])

  const handleSaveBodyWeightValueProgress = () => {
    if (bodyWeightValue) {
      dispatch(saveBodyWeightValueProgress(userData.email, bodyWeightValue))
      setBodyWeightValue(null)
    }
  }

  const handleSavePersonalRecord = (exercise, mark) => {
    if (mark) {
      dispatch(markPersonalRecord(userData.email, exercise, mark))
      setRecordValues([])
    }
  }
  const handleNewPersonalRecord = (exercise, reps) => {
    dispatch(newPersonalRecord(userData.email, exercise, 1))
  }

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

  const AddButton = () => {
    return (
      <View className="absolute bottom-0 right-0" style={{ marginBottom: useBottomTabBarHeight() }}>
        <PressableView>
          <Pressable
            onPress={() =>
              setSelectExerciseModalShow({
                ...selectExerciseModalShow,
                visible: true,
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

  const bodyWeightData = Object.values(userData.userProgress.bodyWeightProgress)
    .map((mark) => {
      return {
        date: moment(mark.date).toISOString(),
        value: mark.bodyWeight,
      }
    })
    .sort((a, b) => moment(a.date).diff(moment(b.date)))

  const bodyWeightDisabled =
    userData.userProgress.bodyWeightProgress[moment(new Date()).format('YYYY-MM-DD')]

  const handleModalScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY < -150) {
      setSelectExerciseModalShow({
        ...selectExerciseModalShow,
        visible: false,
      })
    }
  }

  const BodyWeight = () => {
    return (
      <View className="my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 dark:border-night-3 dark:bg-night-2">
        <Pressable
          onPress={() => {
            navigation.navigate('ProgressView', {
              data: bodyWeightData,
              name: 'BodyWeight',
            })
          }}
        >
          <LineGraph data={bodyWeightData} />
        </Pressable>
        <View className="my-4 flex-row">
          <View className="w-32 flex-row justify-end rounded-lg border-2 border-smoke-3 p-2 dark:border-night-3">
            <TextInput
              inputMode="decimal"
              value={bodyWeightValue}
              onChangeText={(bodyWeightValue) => setBodyWeightValue(bodyWeightValue)}
              editable={
                !userData.userProgress.bodyWeightProgress[moment(new Date()).format('YYYY-MM-DD')]
              }
              maxLength={6}
              textAlign="right"
              enterKeyHint="done"
              className="grow font-custom text-xl dark:text-white"
            />
            <Text className="text-md ml-1 font-custom dark:text-white">Kg</Text>
          </View>
          <PressableView>
            <Pressable
              onPress={handleSaveBodyWeightValueProgress}
              disabled={bodyWeightDisabled}
              className={`ml-4 grow items-center justify-center rounded-lg ${bodyWeightDisabled ? 'bg-smoke-3 dark:bg-night-3' : 'bg-primary-1'} p-1`}
            >
              <Text className="mx-3 font-custom text-xl font-bold text-smoke-2 dark:text-night-2 ">
                Save
              </Text>
            </Pressable>
          </PressableView>
        </View>
      </View>
    )
  }

  const PersonalRecord = ({ userPersonalRecord, index }) => {
    const personalRecordData = Object.values(userPersonalRecord.marks)
      .map((mark) => {
        return {
          date: moment(mark.date).toISOString(),
          value: mark.mark,
        }
      })
      .sort((a, b) => moment(a.date).diff(moment(b.date)))

    const disabled = userData.userProgress.userPersonalRecords.find(
      (personalRecord) =>
        personalRecord.exercise.exerciseName === userPersonalRecord.exercise.exerciseName,
    ).marks[moment(new Date()).format('YYYY-MM-DD')]

    return (
      <View className="my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 dark:border-night-3 dark:bg-night-2">
        <Text className="m-2 font-custom text-xl dark:text-white">
          {userPersonalRecord.exercise.exerciseName}
        </Text>
        <Divider />
        <Pressable
          onPress={() => {
            navigation.navigate('ProgressView', {
              data: personalRecordData,
              name: userPersonalRecord.exercise.exerciseName,
            })
          }}
        >
          <LineGraph data={personalRecordData} />
        </Pressable>
        <View className="my-4 flex-row">
          <View className="w-32 flex-row justify-end rounded-lg border-2 border-smoke-3 p-2 dark:border-night-3">
            <TextInput
              inputMode="decimal"
              value={recordValues[index]}
              onChangeText={(newValue) => {
                const newValues = [...recordValues]
                newValues[index] = newValue
                setRecordValues(newValues)
              }}
              editable={
                !userData.userProgress.userPersonalRecords.find(
                  (personalRecord) =>
                    personalRecord.exercise.exerciseName ===
                    userPersonalRecord.exercise.exerciseName,
                ).marks[moment(new Date()).format('YYYY-MM-DD')]
              }
              maxLength={6}
              textAlign="right"
              enterKeyHint="done"
              className="grow font-custom text-xl dark:text-white"
            />
            <Text className="text-md ml-1 font-custom dark:text-white">Kg</Text>
          </View>
          <PressableView>
            <Pressable
              onPress={() =>
                handleSavePersonalRecord(userPersonalRecord.exercise, recordValues[index])
              }
              disabled={disabled}
              className={`ml-4 grow items-center justify-center rounded-lg ${disabled ? 'bg-smoke-3 dark:bg-night-3' : 'bg-primary-1'} p-1`}
            >
              <Text className="mx-3 font-custom text-xl font-bold text-smoke-2 dark:text-night-2 ">
                Save
              </Text>
            </Pressable>
          </PressableView>
        </View>
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
          bottom: useBottomTabBarHeight(),
          right: 0,
        }}
      >
        <View
          className="mx-2 my-2 grow"
          style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
        >
          <Text className="my-2 font-custom text-2xl dark:text-white">Body Weight</Text>
          <Divider />

          <BodyWeight />

          <Text className="my-2 font-custom text-2xl dark:text-white">Personal Records</Text>
          <Divider />

          {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
            <PersonalRecord key={index} userPersonalRecord={userPersonalRecord} index={index} />
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
                  {['Bicep', 'Tricep', 'Chest', 'Back', 'Legs', 'Shoulder'].map((group, index) => (
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
                        <Text className="font-custom text-3xl dark:text-white">{group}</Text>
                        <View
                          className={`mx-2 h-1.5 rounded-full ${selectExerciseModalShow.groupSelected === group ? 'bg-primary-1' : 'bg-transparent'}`}
                        ></View>
                      </Pressable>
                    </PressableView>
                  ))}
                </View>
                {gainData?.trainingExercises
                  ?.filter(
                    (exercise) => exercise.groupName === selectExerciseModalShow.groupSelected,
                  )
                  ?.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
                  .map((exercise, exerciseIndex) => {
                    const exerciseExists = userData.userProgress.userPersonalRecords.some(
                      (userPersonalRecord) =>
                        userPersonalRecord.exercise.exerciseName === exercise.exerciseName,
                    )
                    return (
                      <ExerciseCard
                        key={exerciseIndex}
                        exercise={exercise}
                        exerciseExists={exerciseExists}
                        onAdd={() => {
                          handleNewPersonalRecord(exercise)
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
            </ScrollView>
          </Modal>
        </View>
      </ScrollView>
      <ScrollToTop />
      <AddButton />
      <AppBar label="Progress" />
    </View>
  )
}
