import { View, Text, Pressable } from "react-native";
import React from "react";

export default function TrainingCard({ navigation, userTrainingData }) {
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("TrainingView", {
          userTrainingData: userTrainingData,
        });
      }}
    >
      <View className="m-5 border p-2">
        <Text>{userTrainingData?.trainingName}</Text>
        {userTrainingData?.days?.map((day, dayIndex) => (
          <View key={dayIndex}>
            <Text>{day.dayName}</Text>
            {day.groups?.map((group, groupIndex) => (
              <View key={groupIndex}>
                <Text>{group.groupName}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </Pressable>
  );
}
