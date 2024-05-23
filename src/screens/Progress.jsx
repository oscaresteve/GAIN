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

export default function Progress({ navigation }) {
  const userData = useSelector(selectUserData)
  const gainData = useSelector(selectGainData)
  const dispatch = useDispatch()
  const [bodyWeightValue, setBodyWeightValue] = useState(null)
  const [recordValues, setRecordValues] = useState([])
  const [selectExerciseModalShow, setSelectExerciseModalShow] = useState(false)

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
              className="m-4 rounded-full bg-smoke-2 dark:bg-night-2"
            >
              <CustomIcon name={'keyboard-double-arrow-up'} size={40} color={'white'} />
            </Pressable>
          </PressableView>
        </View>
      )
    }
  }
  const data = Object.values(userData.userProgress.bodyWeightProgress)
    .map((mark) => {
      return {
        date: moment(mark.date).toISOString(),
        value: mark.bodyWeight,
      }
    })
    .sort((a, b) => moment(a.date).diff(moment(b.date)))

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView ref={scrollViewRef} onScroll={handleScroll}>
        <View
          className="mx-2 my-2 grow"
          style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
        >
          <Text className="my-2 font-custom text-2xl dark:text-white">Body Weight</Text>
          <Divider height={2} />
          <View className="my-2 rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
            <LineGraph data={data} width={350} height={150} />
            <TextInput
              inputMode="decimal"
              value={bodyWeightValue}
              onChangeText={(bodyWeightValue) => setBodyWeightValue(bodyWeightValue)}
              enterKeyHint="done"
              editable={
                !userData.userProgress.bodyWeightProgress[moment(new Date()).format('YYYY-MM-DD')]
              }
              className="m-1 rounded-lg bg-gray-200 p-2"
            />
            <Button
              title="save peso"
              onPress={handleSaveBodyWeightValueProgress}
              disabled={
                userData.userProgress.bodyWeightProgress[moment(new Date()).format('YYYY-MM-DD')]
              }
            />
          </View>

          <Text>Personal Records</Text>

          {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => {
            const data = Object.values(userPersonalRecord.marks)
              .map((mark) => {
                return {
                  date: moment(mark.date).toISOString(),
                  value: mark.mark,
                }
              })
              .sort((a, b) => moment(a.date).diff(moment(b.date)))
            return (
              <View key={index} className="my-2 rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
                <Text className="m-2 font-custom text-xl dark:text-white">
                  {userPersonalRecord.exercise.exerciseName}
                </Text>
                <Divider height={2} />
                <View>
                  <LineGraph data={data} width={350} height={150} />
                </View>

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
                  enterKeyHint="done"
                  className="m-1 rounded-lg bg-gray-200 p-2"
                />
                <Button
                  title="save record"
                  onPress={() =>
                    handleSavePersonalRecord(userPersonalRecord.exercise, recordValues[index])
                  }
                  disabled={
                    userData.userProgress.userPersonalRecords.find(
                      (personalRecord) =>
                        personalRecord.exercise.exerciseName ===
                        userPersonalRecord.exercise.exerciseName,
                    ).marks[moment(new Date()).format('YYYY-MM-DD')]
                  }
                />
                <Button
                  title="View"
                  onPress={() => {
                    navigation.navigate('PersonalRecordView', {
                      userPersonalRecord: userPersonalRecord,
                    })
                  }}
                />
              </View>
            )
          })}

          <Button title="Add Record" onPress={() => setSelectExerciseModalShow(true)} />
          <Modal
            animationType="slide"
            transparent={false}
            visible={selectExerciseModalShow}
            onRequestClose={() => setSelectExerciseModalShow(false)}
          >
            <ScrollView>
              <View className="mt-16 rounded-3xl bg-gray-200 p-2">
                <Button title="Close" onPress={() => setSelectExerciseModalShow(false)} />

                <Text className="text-3xl font-bold">Bicep</Text>
                {gainData?.trainingExercises
                  ?.filter((exercise) => exercise.groupName === 'Bicep')
                  ?.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
                  .map((exercise, exerciseIndex) => {
                    const exerciseExists = userData.userProgress.userPersonalRecords.some(
                      (userPersonalRecord) =>
                        userPersonalRecord.exercise.exerciseName === exercise.exerciseName,
                    )
                    return (
                      <View
                        key={exerciseIndex}
                        className={`m-2 rounded-md bg-white p-2 ${
                          exerciseExists ? 'bg-gray-300' : 'bg-gray-100'
                        }`}
                      >
                        <Pressable
                          onPress={() => {
                            if (!exerciseExists) {
                              handleNewPersonalRecord(exercise)
                              setSelectExerciseModalShow(false)
                            }
                          }}
                          disabled={exerciseExists}
                        >
                          <Text className="text-2xl font-medium">{exercise.exerciseName}</Text>
                        </Pressable>
                      </View>
                    )
                  })}

                <Text className="text-3xl font-bold">Chest</Text>
                {gainData?.trainingExercises
                  ?.filter((exercise) => exercise.groupName === 'Chest')
                  ?.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
                  .map((exercise, exerciseIndex) => {
                    const exerciseExists = userData.userProgress.userPersonalRecords.some(
                      (userPersonalRecord) =>
                        userPersonalRecord.exercise.exerciseName === exercise.exerciseName,
                    )
                    return (
                      <View
                        key={exerciseIndex}
                        className={`m-2 rounded-md bg-white p-2 ${
                          exerciseExists ? 'bg-gray-300' : 'bg-gray-100'
                        }`}
                      >
                        <Pressable
                          onPress={() => {
                            if (!exerciseExists) {
                              handleNewPersonalRecord(exercise)
                              setSelectExerciseModalShow(false)
                            }
                          }}
                          disabled={exerciseExists}
                        >
                          <Text className="text-2xl font-medium">{exercise.exerciseName}</Text>
                        </Pressable>
                      </View>
                    )
                  })}
              </View>
            </ScrollView>
          </Modal>
        </View>
      </ScrollView>
      <ScrollToTop />
      <AppBar label="Progress" />
    </View>
  )
}
