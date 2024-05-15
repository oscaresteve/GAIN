import { View, Text, SafeAreaView, Button } from 'react-native'
import React from 'react'
import LineGraph from '../components/LineGraph'

export default function PersonalRecordView({ navigation, route }) {
  const { userPersonalRecord } = route.params

  return (
    <SafeAreaView>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <Text className="text-2xl">{userPersonalRecord.exercise.exerciseName}</Text>
      <Text>Data:</Text>
      {Object.values(userPersonalRecord.marks).map((mark, index) => (
        <View key={index}>
          <Text>Fecha: {mark.date}</Text>
          <Text>Peso: {mark.mark}</Text>
        </View>
      ))}

      <View className="border items-center">
        <LineGraph data={userPersonalRecord.marks} />
      </View>
    </SafeAreaView>
  )
}
