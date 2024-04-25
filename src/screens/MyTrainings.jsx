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
    <SafeAreaView className="flex-1">
      <AppBar />
      <View>
        <ScrollView>
          <View className="pb-10 pt-2">
            {userAllTrainingsData?.map((userTrainingData, index) => (
              <TrainingCard
                key={index}
                userTrainingData={userTrainingData}
                navigation={navigation}
              />
            ))}
            <View className="mx-4 mb-2 p-2 bg-white rounded-md shadow-sm">
              <Pressable onPress={() => navigation.navigate("CreateTraining")}>
                <View className="p-1 bg-gray-50 rounded-md shadow-sm">
                  <Text className="text-xl font-bold">Create new Training</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
