import { View, Text } from 'react-native'
import React from 'react'

export default function RestDayTrainingView({ tomorrowTrainingDayData }) {
  return (
    <View>
      <Text>RestDayTrainingView</Text>
      <Text className="text-2xl">Tomorrow:</Text>
      <Text>{JSON.stringify(tomorrowTrainingDayData, null, 2)}</Text>
    </View>
  )
}
