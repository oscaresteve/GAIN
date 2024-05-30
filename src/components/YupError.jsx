import { View, Text } from 'react-native'
import React from 'react'
import CustomIcon from './CustomIcon'

export default function YupError({ error }) {
  return (
    <View className="flex-row items-center">
      <CustomIcon name={'info'} color={'#FF3333'} size={16} />
      <Text className="text-md mx-1 font-rubik-regular text-vermillion">{error.message}</Text>
    </View>
  )
}
