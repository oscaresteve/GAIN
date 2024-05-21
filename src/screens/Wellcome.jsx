import { View, Text, Pressable, SafeAreaView, Image } from 'react-native'
import React from 'react'
import PressableView from '../components/PressableView'

export default function Wellcome({ navigation }) {
  return (
    <SafeAreaView className="grow bg-smoke-1 dark:bg-night-1">
      <View className="grow items-center">
        <View className="grow items-center ">
          <Image
            source={require('../../assets/logos/gain-logo.png')}
            className="h-52 w-52 mt-20 mb-20 "
          />
          <View className="mx-5">
            <Text className="text-5xl font-custom text-center text-black dark:text-white">
              ¡Wellcome!
            </Text>
            <Text className="text-lg font-custom text-center my-2 text-black dark:text-white">
              Start progressing every day. Each step takes you closer to your best version.
            </Text>
          </View>
        </View>
      </View>
      <View className="items-center mb-20 grow">
        <PressableView>
          <Pressable onPress={() => navigation.navigate('LogIn')}>
            <Text className="text-3xl font-custom text-primary-1">¡Get Started!</Text>
          </Pressable>
        </PressableView>
      </View>
    </SafeAreaView>
  )
}
