import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import TrainingDayView from "../components/TrainingDayView";
import AppBar from "../components/AppBar";

export default function Home() {
  return (
    <SafeAreaView className="h-full">
      <AppBar />
      <TrainingDayView
        email="oscar@esteve.com"
        userTrainingName="TrainingTestNuevo"
      />
    </SafeAreaView>
  );
}
