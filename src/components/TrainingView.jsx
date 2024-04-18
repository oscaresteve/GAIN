import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { getUserTraining } from "../database/Database";
import trainingTest from "../database/trainingTest.json";

export default function Training({ email, userTrainingName }) {
  const [userTrainingData, setUserTrainingData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const userTraininSnap = await getUserTraining(email, userTrainingName);
      if (userTraininSnap !== false) {
        setUserTrainingData(userTraininSnap);
      } else {
      }
    };
    fetchData();
  }, []);

  if (userTrainingData) {
    return (
      <View key={userTrainingData.trainingName}>
        <Text>{userTrainingData.trainingName}</Text>

        {userTrainingData.days.map((day, dayIndex) => (
          <View key={dayIndex}>
            <Text>{day.dayName}</Text>

            {day.groups.map((group, groupIndex) => (
              <View key={groupIndex}>
                <Text>{group.groupName}</Text>

                {group.exercises.map((exercise, exerciseIndex) => (
                  <View key={exerciseIndex}>
                    <Text>{exercise.exerciseName}</Text>

                    {exercise.sets.map((set, setIndex) => (
                      <View key={setIndex}>
                        <Text>
                          Set {set.setNumber}: Reps {set.details.reps}, Weight{" "}
                          {set.details.weight}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }
}
