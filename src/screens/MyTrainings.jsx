import {
  View,
  SafeAreaView,
  Button,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import AppBar from "../components/AppBar";
import TrainingCard from "../components/TrainingCard";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { selectUserData } from "../Redux/userSlice";
import { selectUserAllTrainingsData } from "../Redux/userSlice";
import { fetchUserAllTrainingsData } from "../Redux/userSlice";

export default function MyTrainings({ navigation }) {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const userAllTrainings = useSelector(selectUserAllTrainingsData);

  useEffect(() => {
    dispatch(fetchUserAllTrainingsData(userData?.email));
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <AppBar />
      <View>
        <ScrollView>
          <View className="pb-10 pt-2">
            {userAllTrainings?.map((userTrainingData, index) => (
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
