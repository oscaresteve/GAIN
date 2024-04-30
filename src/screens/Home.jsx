import { View, SafeAreaView } from "react-native";
import React from "react";
import TrainingDayView from "../components/TrainingDayView";
import AppBar from "../components/AppBar";

export default function Home() {
  return (
    <SafeAreaView className="flex-1">
      <AppBar />
      <View>
        <TrainingDayView userTrainingName="TrainingTestNuevo" />
      </View>
    </SafeAreaView>
  );
}
