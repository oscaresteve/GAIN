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
  saveBodyWeightProgress,
  selectUserData,
  newPersonalRecord,
  markPersonalRecord,
} from '../Redux/userSlice'
import { selectGainData, fetchGainData } from '../Redux/gainSlice'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export default function Progress() {
  const userData = useSelector(selectUserData)
  const gainData = useSelector(selectGainData)
  const dispatch = useDispatch()

  const [selectExerciseModalShow, setSelectExerciseModalShow] = useState(false)

  useEffect(() => {
    dispatch(fetchGainData())
  }, [])

  const validationSchema = yup
    .object()
    .shape({
      bodyWeight: yup.number().max(200),
    })
    .required()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) })

  const handleSaveBodyWeightProgress = (formData) => {
    if (formData.bodyWeight) {
      dispatch(saveBodyWeightProgress(userData.email, formData.bodyWeight))
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

        <Controller
          name="bodyWeight"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              inputMode="numeric"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              enterKeyHint="done"
              className="bg-gray-200 p-2 m-1 rounded-lg"
            />
          )}
        />
        <Text>Personal Records</Text>
        {userData.userProgress.userPersonalRecords.map((userPersonalRecord, index) => (
          <View key={index}>
            <Text>{userPersonalRecord.exercise.exerciseName}</Text>
            <Button title="View" /* onPress={} */ />
          </View>
        ))}
        <Button
          title="Añadir trackeo del peso"
          onPress={handleSubmit(handleSaveBodyWeightProgress)}
        />
        <Button title="Add Exercise" onPress={() => setSelectExerciseModalShow(true)} />
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
