import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function YupError({ error }) {
  return (
    <View className="flex-row items-center">
      <Icon name="info" color={'#FF3333'} size={16} />
      <Text className="text-md mx-1 font-custom text-vermillion">{error.message}</Text>
    </View>
  )
}
