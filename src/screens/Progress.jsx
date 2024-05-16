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
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  saveBodyWeightValueProgress,
  selectUserData,
  newPersonalRecord,
  markPersonalRecord,
} from '../Redux/userSlice'
import { selectGainData, fetchGainData } from '../Redux/gainSlice'
import moment from 'moment'

export default function Progress({ navigation }) {
  const userData = useSelector(selectUserData)
  const gainData = useSelector(selectGainData)
  const dispatch = useDispatch()
  const [bodyWeightValue, setBodyWeightValue] = useState(null)
  const [recordValues, setRecordValues] = useState([])
  const [selectExerciseModalShow, setSelectExerciseModalShow] = useState(false)

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

  return (
    <SafeAreaView>
      <Text>Progress</Text>
      <View>
        <Text>Progreso del peso</Text>
        <View className="bg-white my-1 p-2 rounded-md shadow-sm">
          <TextInput
            inputMode="decimal"
            value={bodyWeightValue}
            onChangeText={(bodyWeightValue) => setBodyWeightValue(bodyWeightValue)}
            enterKeyHint="done"
            editable={
              !userData.userProgress.bodyWeightProgress[moment(new Date()).format('YYYY-MM-DD')]
            }
            className="bg-gray-200 p-2 m-1 rounded-lg"
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
        <ScrollView>
          {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => {
            return (
              <View key={index} className="bg-white my-1 p-2 rounded-md shadow-sm">
                <Text>{userPersonalRecord.exercise.exerciseName}</Text>
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
                        userPersonalRecord.exercise.exerciseName
                    ).marks[moment(new Date()).format('YYYY-MM-DD')]
                  }
                  enterKeyHint="done"
                  className="bg-gray-200 p-2 m-1 rounded-lg"
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
                        userPersonalRecord.exercise.exerciseName
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
        </ScrollView>
        <Button title="Add Record" onPress={() => setSelectExerciseModalShow(true)} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={selectExerciseModalShow}
          onRequestClose={() => setSelectExerciseModalShow(false)}
        >
          <ScrollView>
            <View className="bg-gray-200 rounded-3xl mt-16 p-2">
              <Button title="Close" onPress={() => setSelectExerciseModalShow(false)} />

              <Text className="text-3xl font-bold">Bicep</Text>
              {gainData?.trainingExercises
                ?.filter((exercise) => exercise.groupName === 'Bicep')
                ?.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
                .map((exercise, exerciseIndex) => {
                  const exerciseExists = userData.userProgress.userPersonalRecords.some(
                    (userPersonalRecord) =>
                      userPersonalRecord.exercise.exerciseName === exercise.exerciseName
                  )
                  return (
                    <View
                      key={exerciseIndex}
                      className={`bg-white m-2 p-2 rounded-md shadow-sm ${
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
                      userPersonalRecord.exercise.exerciseName === exercise.exerciseName
                  )
                  return (
                    <View
                      key={exerciseIndex}
                      className={`bg-white m-2 p-2 rounded-md shadow-sm ${
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
    </SafeAreaView>
  )
}
