import { View, Text, Button, SafeAreaView } from "react-native";
import React from "react";

export default function Register({ navigation }) {
  return (
    <SafeAreaView>
      <Text>Register</Text>
      <Button title="Done" onPress={() => navigation.navigate("TabGroup")} />
    </SafeAreaView>
  );
}
