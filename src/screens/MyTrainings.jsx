import { View, SafeAreaView, ScrollView, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import AppBar from "../components/AppBar";
import TrainingCard from "../components/TrainingCard";
import { getUserAllTrainings } from "../database/Database";

export default function MyTrainings({ navigation }) {
  const [userAllTrainingsData, setUserAllTrainingsData] = useState();

  const fetchData = async () => {
    setUserAllTrainingsData(await getUserAllTrainings("oscar@esteve.com"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <AppBar />
      <View>
        {userAllTrainingsData?.map((userTrainingData, index) => (
          <TrainingCard
            key={index}
            userTrainingData={userTrainingData}
            navigation={navigation}
          />
        ))}
        <View className="m-5 border p-2">
          <Pressable
            onPress={() => {
              navigation.navigate("CreateTraining");
            }}
          >
            <Text>Create new Training</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
