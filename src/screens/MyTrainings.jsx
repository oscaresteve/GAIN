import { View, Text, SafeAreaView, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import AppBar from "../components/AppBar";
import TrainingView from "../components/TrainingView";

export default function MyTrainings() {
  return (
    <SafeAreaView>
      <AppBar />
      <ScrollView>
        <TrainingView
          email="oscar@esteve.com"
          userTrainingName="TrainingTestNuevo"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
