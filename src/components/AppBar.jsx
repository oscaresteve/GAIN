import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import moment from 'moment'
import { BlurView } from 'expo-blur'
import PressableView from './PressableView'
import CustomIcon from './CustomIcon'

const height = 110

export const useAppBarHeight = () => {
  return height
}

export default function AppBar({ label, backButton, navigation }) {
  const currentDate = new Date()
  const Label = () => {
    if (label) {
      return <Text className="ml-4 font-custom text-2xl dark:text-white">{label}</Text>
    } else {
      return (
        <Text className="ml-4 font-custom text-2xl dark:text-white">
          {moment(currentDate).format('dddd')} {moment(currentDate).format('Do')}
        </Text>
      )
    }
  }
  const Icon = () => {
    if (backButton) {
      return (
        <PressableView>
          <Pressable
            onPress={() => {
              navigation.goBack()
            }}
          >
            <CustomIcon name={'keyboard-arrow-left'} size={40} color={'white'} />
          </Pressable>
        </PressableView>
      )
    } else {
      return (
        <View>
          <Image source={require('../../assets/logos/gain-logo.png')} className="h-10 w-10" />
        </View>
      )
    }
  }

  return (
    <BlurView
      intensity={100}
      className="absolute w-full justify-end border-b border-b-smoke-3 p-4 dark:border-b-night-3"
      style={{ height: height }}
    >
      <View className="flex-row items-center">
        <Icon />
        <Label />
      </View>
    </BlurView>
  )
}
