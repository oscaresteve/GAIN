import { View, Text, Image, SafeAreaView } from 'react-native'
import React from 'react'
import moment from 'moment'
import { BlurView } from 'expo-blur'

const height = 110

export const useAppBarHeight = () => {
  return height
}

export default function AppBar() {
  const currentDate = new Date()
  const currentDay = moment(currentDate).format('dddd')

  return (
    <BlurView
      intensity={100}
      className="absolute w-full flex-row items-end p-4"
      style={{ height: height }}
    >
      <Image source={require('../../assets/logos/gain-logo.png')} className="h-10 w-10" />
      <Text className="ml-4 font-custom text-2xl dark:text-white">
        {currentDay} {moment(currentDate).format('Do')}
      </Text>
    </BlurView>
  )
}
