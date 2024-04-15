import { View, Text } from "react-native";
import React from "react";
import moment from "moment";

export default function AppBar() {
  const currentDate = new Date();
  const currentDay = moment(currentDate).format("dddd");

  return (
    <View className="flex-row w-full bg-gray-300 items-center">
      <Text className="text-xl font-bold m-2">GAIN</Text>
      <Text className="text-lg">
        {currentDay} {moment(currentDate).format("Do")}
      </Text>
    </View>
  );
}
