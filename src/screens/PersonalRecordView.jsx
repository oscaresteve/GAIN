import { View, Text, SafeAreaView, Button } from 'react-native'
import React from 'react'
import LineGraph from '../components/LineGraph'
import moment from 'moment'

export default function PersonalRecordView({ navigation, route }) {
  const { userPersonalRecord } = route.params

  const data = Object.values(userPersonalRecord.marks)
    .map((mark) => {
      return {
        date: moment(mark.date).toISOString(),
        value: mark.mark,
      }
    })
    .sort((a, b) => moment(a.date).diff(moment(b.date)))

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
        <LineGraph data={data} />
      </View>
    </SafeAreaView>
  )
}
