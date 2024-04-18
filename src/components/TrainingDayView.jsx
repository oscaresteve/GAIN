import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { getUserTrainingDay, newUserTrainingDay } from "../database/Database";

export default function TrainingDayView({ email, userTrainingName }) {
  const [userTrainingDayData, setUserTrainingDayData] = useState();

  const fetchData = async () => {
    const userTrainingDaySnap = await getUserTrainingDay(email);
    if (userTrainingDaySnap !== false) {
      setUserTrainingDayData(userTrainingDaySnap);
    } else {
      newUserTrainingDay(email, userTrainingName);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDone = (groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingDayData((prevData) => {
      const newUserTrainingDayData = { ...prevData };
      prevData.groups[groupIndex].exercises[exerciseIndex].sets[
        setIndex
      ].details.done = true;

      return newUserTrainingDayData;
    });
    console.log(JSON.stringify(userTrainingDayData, null, 2));
  };

  if (userTrainingDayData) {
    return (
      <View key={userTrainingDayData.dayName}>
        <Text>{userTrainingDayData.dayName}</Text>

        {userTrainingDayData.groups.map((group, groupIndex) => (
          <View key={groupIndex}>
            <Text>{group.groupName}</Text>

            {group.exercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex}>
                <Text>{exercise.exerciseName}</Text>

                {exercise.sets.map((set, setIndex) => (
                  <View
                    key={setIndex}
                    className={`flex-row justify-between m-1 p-2 ${
                      set.details.done ? "bg-green-300" : "bg-gray-300"
                    }`}
                  >
                    <Text>
                      Set {set.setNumber}: Reps {set.details.reps}, Weight{" "}
                      {set.details.weight}
                    </Text>
                    <Pressable
                      onPress={() =>
                        handleDone(groupIndex, exerciseIndex, setIndex)
                      }
                      disabled={
                        setIndex === 0
                          ? false
                          : !exercise.sets[setIndex - 1].details.done
                      }
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
