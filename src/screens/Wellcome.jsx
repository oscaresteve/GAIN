import { View, Text, Pressable, SafeAreaView } from "react-native";
import React from "react";

export default function Wellcome({ navigation }) {
  return (
    <SafeAreaView className="bg-gray-200 h-full justify-center items-center">
      <View className="bg-gray-300 rounded-lg p-5 w-80">
        <Text className="text-4xl font-bold text-center">Wellcome</Text>
        <Text className="text-xl text-center">Mensaje de Bienvenida</Text>
        <Pressable
          title="Log In"
          onPress={() => navigation.navigate("LogIn")}
          className="bg-gray-400 justify-center items-center p-3 rounded-lg m-1"
        >
          <Text className="text-lg font-bold">Inicia Sesion</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          className="bg-gray-400 justify-center items-center p-3 rounded-lg m-1"
        >
          <Text className="text-lg font-bold">Crea tu cuenta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
