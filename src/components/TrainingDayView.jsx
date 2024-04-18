import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { getUserTrainingDay, newUserTrainingDay } from "../database/Database";
import { render } from "react-dom";

export default function TrainingDayView({ email, userTrainingName }) {
  const [userTrainingDayData, setUserTrainingDayData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const userTrainingDaySnap = await getUserTrainingDay(email);
      if (userTrainingDaySnap !== false) {
        setUserTrainingDayData(userTrainingDaySnap);
      } else {
        newUserTrainingDay(email, userTrainingName);
      }
    };
    fetchData();
  }, []);

  if (userTrainingDayData) {
    return (
      <View key={userTrainingDayData.dayName}>
        <Text>{userTrainingDayData.dayName}</Text>

        {userTrainingDayData.groups.map((group) => (
          <View key={group.groupName}>
            <Text>{group.groupName}</Text>

            {group.exercises.map((exercise) => (
              <View key={exercise.exerciseName}>
                <Text>{exercise.exerciseName}</Text>

                {exercise.sets.map((set) => (
                  <View
                    key={set.setNumber}
                    className={`flex-row justify-between m-1 p-2 ${
                      set.details.done ? "bg-green-50" : "bg-slate-50"
                    }`}
                  >
                    <Text>
                      Set {set.setNumber}: Reps {set.details.reps}, Weight{" "}
                      {set.details.weight}
                    </Text>
                    <Pressable
                      onPress={() => {
                        set.details.done = true;
                        console.log(
                          JSON.stringify(userTrainingDayData, null, 2)
                        );
                      }}
                    >
                      <Text>Done</Text>
                    </Pressable>
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
