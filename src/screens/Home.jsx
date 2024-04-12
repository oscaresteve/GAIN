import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import TrainingView from "../components/TrainingView";
import { getUserTraining } from "../database/Database";

export default function Home() {
  const currentDate = new Date();
  const currentDay = moment(currentDate).format("dddd")
  const [userTrainingData, setUserTrainingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setUserTrainingData(await getUserTraining("oscar@esteve.com", "Training Test"));
    };
    fetchData();
  }, [])

  console.log("HOME: ", userTrainingData);
  return (
    <SafeAreaView>
      <Text>Home</Text>
      <Text>
        {currentDay} {moment(currentDate).format("Do")}
      </Text>
      <TrainingView day={currentDay} userTrainingData={userTrainingData} />
    </SafeAreaView>
  );
}
