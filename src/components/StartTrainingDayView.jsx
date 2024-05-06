import { View, Text, Button } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { startUserTrainingDay } from "../Redux/userSlice";
export default function StartTrainingView() {
  const dispatch = useDispatch();
  const handleStartTrainingDay = () => {
    dispatch(startUserTrainingDay());
  };
  return (
    <View>
      <Text>StartTrainingView</Text>
      <View>
        <Button title="start training now" onPress={handleStartTrainingDay} />
      </View>
    </View>
  );
}
