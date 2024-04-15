import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import AppBar from "../components/AppBar";

export default function MyTrainings() {
  return (
    <SafeAreaView>
      <AppBar />
      <Text>Trainings</Text>
    </SafeAreaView>
  );
}
