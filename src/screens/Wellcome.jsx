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
            className="mb-20 mt-20 h-52 w-52 "
          />
          <View className="mx-5">
            <Text className="text-center font-rubik-medium text-5xl text-black dark:text-white">
              ¡Bienvenido!
            </Text>
            <Text className="my-2 text-center font-rubik-regular text-lg text-black dark:text-white">
              Empieza a progresar cada día. Cada paso te acerca más a tu mejor versión.
            </Text>
          </View>
        </View>
      </View>
      <View className="mb-20 grow items-center">
        <PressableView onPress={() => navigation.navigate('LogIn')}>
          <Text className="font-rubik-regular text-3xl text-primary-1">¡Empezemos!</Text>
        </PressableView>
      </View>
    </SafeAreaView>
  )
}
