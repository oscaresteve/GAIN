import { View, Text, Button, SafeAreaView } from "react-native";
import React from "react";

export default function Wellcome({ navigation }) {
  return (
    <SafeAreaView>
      <Text>Wellcome</Text>
      <Button title="Log In" onPress={() => navigation.navigate("LogIn")} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </SafeAreaView>
  );
}
