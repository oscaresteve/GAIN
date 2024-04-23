import {
  View,
  SafeAreaView,
  Button,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AppBar from "../components/AppBar";
import TrainingCard from "../components/TrainingCard";
import { getUserAllTrainings } from "../database/Database";
import { useFocusEffect } from "@react-navigation/native";

export default function MyTrainings({ navigation }) {
  const [userAllTrainingsData, setUserAllTrainingsData] = useState();

  const fetchData = async () => {
    setUserAllTrainingsData(await getUserAllTrainings("oscar@esteve.com"));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView>
      <AppBar />
      <ScrollView>
        <View>
          {userAllTrainingsData?.map((userTrainingData, index) => (
            <TrainingCard
              key={index}
              userTrainingData={userTrainingData}
              navigation={navigation}
            />
          ))}
          <View className="m-5 border p-2">
            <Pressable onPress={() => navigation.navigate("CreateTraining")}>
              <Text>Create new Training</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
