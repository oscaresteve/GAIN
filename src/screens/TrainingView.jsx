import { View, Text, ScrollView, Button, SafeAreaView } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUserData, deleteUserTrainingData, setUserTrainingPrimary } from '../Redux/userSlice'
import moment from 'moment'

export default function Training({ navigation, route }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const { userTrainingData } = route.params

  const handleDeleteTraining = () => {
    dispatch(deleteUserTrainingData(userData.email, userTrainingData.trainingName))
    navigation.goBack()
  }

  const handleMakeTrainingPrimary = (trainingName) => {
    dispatch(setUserTrainingPrimary(trainingName))
    navigation.goBack()
  }

  const handleEditTraining = () => {
    navigation.navigate('EditTraining', {
      userTrainingData: userTrainingData,
    })
  }

  return (
    <SafeAreaView>
      <Button title="Back" onPress={navigation.goBack} />
      <Button title="Edit" onPress={handleEditTraining} />
      <Button
        title="Delete"
        onPress={handleDeleteTraining}
        disabled={userTrainingData.primary ? true : false}
      />
      <Button
        title="Make primary"
        onPress={() => handleMakeTrainingPrimary(userTrainingData.trainingName)}
        disabled={userTrainingData.primary ? true : false}
      />
      <ScrollView>
        <View key={userTrainingData.trainingName}>
          <Text className="text-4xl font-bold">{userTrainingData.trainingName}</Text>

          {userTrainingData.days?.map((day, dayIndex) => (
            <View key={dayIndex}>
              <Text className="text-3xl font-bold">{moment(day.day, 'd').format('dddd')}</Text>

              {day.groups?.map((group, groupIndex) => (
                <View key={groupIndex}>
                  <Text className="text-2xl font-bold">{group.groupName}</Text>

                  {group.exercises?.map((exercise, exerciseIndex) => (
                    <View key={exerciseIndex} className="bg-white my-1 p-2 rounded-md shadow-sm">
                      <Text className="text-2xl font-medium">{exercise.exerciseName}</Text>

                      {exercise.sets?.map((set, setIndex) => (
                        <View
                          key={setIndex}
                          className="flex-row justify-between items-center my-1 p-2 shadow-sm rounded-md bg-gray-200"
                        >
                          <View className="flex-row items-center justify-around flex-grow">
                            <View className="">
                              <Text className="text-lg">{set.setNumber}</Text>
                            </View>
                            <View className="">
                              <Text className="text-lg">{set.details.reps} reps</Text>
                            </View>
                            <View className="">
                              <Text className="text-lg">{set.details.weight} kg</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
