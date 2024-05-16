import { View, Text, Pressable, SafeAreaView } from 'react-native'
import React from 'react'

export default function Wellcome({ navigation }) {
  return (
    <SafeAreaView className="grow bg-white">
      <View className="grow">
        <Text className="text-5xl font-custom text-center">Wellcome</Text>
        <Text className="text-lg font-custom text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit in diam nonumy eirmod tempor
          incididunt ut labore et dolore mag et dolore mag et dolore mag et dolore mag et dolore mag
          et d molestie
        </Text>
      </View>
      <View className="bg-gray-200 mb-10">
        <Pressable
          title="Log In"
          onPress={() => navigation.navigate('LogIn')}
          className="bg-gray-400 justify-center items-center p-3 rounded-lg m-1"
        >
          <Text className="text-lg font-bold">Inicia Sesion</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Register')}
          className="bg-gray-400 justify-center items-center p-3 rounded-lg m-1"
        >
          <Text className="text-lg font-bold">Crea tu cuenta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
