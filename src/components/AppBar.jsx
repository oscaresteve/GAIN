import { View, Text } from 'react-native'
import React from 'react'
import moment from 'moment'

export default function AppBar() {
  const currentDate = new Date()
  const currentDay = moment(currentDate).format('dddd')

  return (
    <View className="flex-row items-center">
      <Text className="text-3xl font-bold my-1 mx-2">GAIN</Text>
      <Text className="text-lg">
        {currentDay} {moment(currentDate).format('Do')}
      </Text>
    </View>
  )
}
