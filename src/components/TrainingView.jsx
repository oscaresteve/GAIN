import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";

export default function Training({ day, userTrainingData }) {
  if (userTrainingData) {
    if (userTrainingData[day]) {
      return (
        <View key={day}>
          {Object.keys(userTrainingData[day]).map((group) => {
            return (
              <View key={group}>
                <Text>{group}</Text>
                {Object.keys(userTrainingData[day][group]).map((exercise) => {
                  return (
                    <View key={exercise}>
                      <Text>{exercise}</Text>
                      {Object.keys(userTrainingData[day][group][exercise]).map(
                        (set) => {
                          return (
                            <View key={set}>
                              <Text>{set}{" --- "}
                                {userTrainingData[day][group][exercise][set]["reps"]}{" --- "}
                                {userTrainingData[day][group][exercise][set]["kg"]}
                              </Text>
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
