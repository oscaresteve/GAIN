import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getUserTrainingDay,
  newUserTrainingDay,
  setUserTrainingDay,
} from "../database/Database";

export default function TrainingDayView({ email, userTrainingName }) {
  const [userTrainingDayData, setUserTrainingDayData] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userTrainingDaySnap = await getUserTrainingDay(email);
    if (userTrainingDaySnap !== false) {
      setUserTrainingDayData(userTrainingDaySnap);
    } else {
      await newUserTrainingDay(email, userTrainingName);
      setUserTrainingDayData(await getUserTrainingDay(email));
    }
  };

  const saveData = async () => {
    await setUserTrainingDay(email, userTrainingDayData);
  };

  const handleDone = (groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingDayData((prevData) => {
      const newUserTrainingDayData = { ...prevData };
      newUserTrainingDayData.groups[groupIndex].exercises[exerciseIndex].sets[
        setIndex
      ].details.done = true;

      return newUserTrainingDayData;
    });
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
