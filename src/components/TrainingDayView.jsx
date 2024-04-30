import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { setUserTrainingDay } from "../database/Database";
import { useSelector } from "react-redux";
import { selectUserData } from "../Redux/userSlice";
import { selectUserTrainingDayData } from "../Redux/userSlice";
import { useDispatch } from "react-redux";
import { setUserTrainingDayData } from "../Redux/userSlice";
import { fetchUserTrainingDayData } from "../Redux/userSlice";

export default function TrainingDayView({ userTrainingName }) {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const userTrainingDayData = useSelector(selectUserTrainingDayData);

  useEffect(() => {
    dispatch(fetchUserTrainingDayData(userData?.email, userTrainingName));
  }, []);

  const saveData = async () => {
    await setUserTrainingDay(userData?.email, userTrainingDayData);
  };

  const handleDone = (groupIndex, exerciseIndex, setIndex) => {
    const newUserTrainingDayData = { ...userTrainingDayData };
    userTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets[
      setIndex
    ].details.done = true;
    console.log(
      "newUserTrainingDayData",
      JSON.stringify(newUserTrainingDayData, null, 2)
    );
    dispatch(setUserTrainingDayData(newUserTrainingDayData));
    console.log(
      "userTrainingDayData",
      JSON.stringify(userTrainingDayData, null, 2)
    );
    saveData();
  };

  return (
    <ScrollView>
      <View className="flex-1 pb-10">
        {userTrainingDayData?.groups?.map((group, groupIndex) => (
          <View key={groupIndex} className="mx-2">
            <Text className="text-3xl font-bold">{group.groupName}</Text>
            {group.exercises?.map((exercise, exerciseIndex) => (
              <View
                key={exerciseIndex}
                className="bg-white my-1 p-2 rounded-md shadow-sm"
              >
                <Text className="text-2xl font-medium">
                  {exercise.exerciseName}
                </Text>
                {exercise.sets?.map((set, setIndex) => (
                  <View
                    key={setIndex}
                    className={`flex-row justify-between items-center my-1 p-2 shadow-sm rounded-md  ${
                      set.details.done ? "bg-green-300" : "bg-gray-50"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="w-10">
                        <Text className="text-lg">{set.setNumber}</Text>
                      </View>
                      <View className="w-24">
                        <Text className="text-lg">{set.details.reps} reps</Text>
                      </View>
                      <View className="w-24">
                        <Text className="text-lg">{set.details.weight} kg</Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() =>
                        handleDone(groupIndex, exerciseIndex, setIndex)
                      }
                      disabled={
                        setIndex === 0
                          ? false
                          : !exercise.sets[setIndex - 1].details.done
                      }
                      className="flex-end items-center"
                    >
                      <Text className="text-lg font-bold mx-2">Done</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
