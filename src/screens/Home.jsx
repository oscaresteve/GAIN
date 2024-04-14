import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import TrainingView from "../components/TrainingView";
import { getUserTraining } from "../database/Database";

export default function Home() {
  const currentDate = new Date();
  const currentDay = moment(currentDate).format("dddd");
  const [userTrainingData, setUserTrainingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setUserTrainingData(
        await getUserTraining("oscar@esteve.com", "Training Test")
      );
    };
    fetchData();
  }, []);

  console.log("HOME: ", userTrainingData);
  return (
    <SafeAreaView className="bg-gray-200 h-full items-center">
      <ScrollView className="w-full">
        <Text className="text-3xl font-bold w-full py-3">
          {currentDay} {moment(currentDate).format("Do")}
        </Text>
        <TrainingView day={currentDay} userTrainingData={userTrainingData} />
      </ScrollView>
    </SafeAreaView>
  );
}
