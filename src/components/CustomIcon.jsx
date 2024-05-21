import React from 'react'
import { useColorScheme } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function CustomIcon({ name, size, color }) {
  const colorScheme = useColorScheme()

  const getColor = (color) => {
    if (color === 'black') {
      return colorScheme === 'light' ? 'black' : 'white'
    } else if (color === 1) {
      return colorScheme === 'light' ? '#F2F2F2' : '#0D0D0D'
    } else if (color === 2) {
      return colorScheme === 'light' ? '#E6E6E6' : '#1A1A1A'
    } else if (color === 3) {
      return colorScheme === 'light' ? '#D9D9D9' : '#262626'
    } else return color
  }

  return <Icon name={name} size={size} color={getColor(color)} />
}
