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
            <Text className="text-center font-rubik-medium text-5xl dark:text-white">
              ¡Bienvenido!
            </Text>
            <Text className="my-2 text-center font-rubik-regular text-lg opacity-80 dark:text-white">
              Empieza a progresar cada día. Cada paso te acerca más a tu mejor versión.
            </Text>
          </View>
        </View>
      </View>
      <View className="mb-20 grow items-center">
        <PressableView onPress={() => navigation.navigate('LogIn')} haptic={'Heavy'}>
          <Text className="font-rubik-italic text-3xl text-primary-1">¡Empezemos!</Text>
        </PressableView>
      </View>
    </SafeAreaView>
  )
}
