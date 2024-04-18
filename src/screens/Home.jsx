import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import TrainingDayView from "../components/TrainingDayView";
import AppBar from "../components/AppBar";

export default function Home() {
  const currentDate = new Date();
  const currentDay = moment(currentDate).format("dddd");

  return (
    <SafeAreaView className="bg-gray-200 h-full items-center">
      <AppBar />
      <ScrollView className="w-full">
        <TrainingDayView
          email="oscar@esteve.com"
          userTrainingName="TrainingTestNuevo"
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}
