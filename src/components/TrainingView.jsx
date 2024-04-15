import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

export default function Training({ day, userTrainingData }) {
  if (userTrainingData) {
    if (userTrainingData[day]) {
      return (
        <View key={day} className="">
          {Object.keys(userTrainingData[day]).map((group) => {
            return (
              <View key={group} className="">
                <Text className="text-xl font-bold">{group}</Text>
                {Object.keys(userTrainingData[day][group]).map((exercise) => {
                  return (
                    <View key={exercise} className="bg-gray-400 p-2 m-1 rounded-lg">
                      <Text className="text-md font-bold">{exercise}</Text>
                      {Object.keys(userTrainingData[day][group][exercise]).map(
                        (set) => {
                          return (
                            <View key={set} className="bg-gray-300 p-3 m-1 rounded-lg flex-row justify-between">
                              <Text>{set}{" - "}
                                {userTrainingData[day][group][exercise][set]["reps"]}{" reps "}
                                {userTrainingData[day][group][exercise][set]["kg"]}{" kg "}
                              </Text>
                              <Pressable><Text>Done</Text></Pressable>
                            </View>
                          );
                        }
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      );
    } else {
      return (
        <View>
          <Text>Rest Day!!!</Text>
        </View>
      );
    }
  } else {
    return (
      <View>
        <Text>No Training Found!!!</Text>
      </View>
    );
  }
}
