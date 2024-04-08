import { View, Text, Button, SafeAreaView } from "react-native";
import React from "react";

export default function Wellcome({ navigation }) {
  return (
    <SafeAreaView>
      <Text>Wellcome</Text>
      <Button title="Start" onPress={() => navigation.navigate("LogIn")} />
    </SafeAreaView>
  );
}
