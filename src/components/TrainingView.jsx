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

        {userTrainingData.days.map((day) => (
          <View key={day.dayName}>
            <Text>{day.dayName}</Text>

            {day.groups.map((group) => (
              <View key={group.groupName}>
                <Text>{group.groupName}</Text>

                {group.exercises.map((exercise) => (
                  <View key={exercise.exerciseName}>
                    <Text>{exercise.exerciseName}</Text>

                    {exercise.sets.map((set) => (
                      <View key={set.setNumber}>
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
