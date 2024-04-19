import {
  View,
  Text,
  SafeAreaView,
  Button,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";

export default function CreateTraining({ navigation }) {
  const [userTrainingData, setUserTrainingData] = useState({
    trainingName: "",
    days: [
      { dayName: "Monday", groups: [] },
      { dayName: "Tuesday", groups: [] },
      { dayName: "Wednesday", groups: [] },
      { dayName: "Thursday", groups: [] },
      { dayName: "Friday", groups: [] },
      { dayName: "Saturday", groups: [] },
      { dayName: "Sunday", groups: [] },
    ],
  });

  const handleAddExercise = (dayIndex) => {
    const exercise = {
      groupName: "Chest",
      exerciseName: "Banca",
    };

    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      const existingGroup = newUserTrainingData.days[dayIndex].groups.find(
        (group) => group.groupName === exercise.groupName
      );

      if (existingGroup) {
        existingGroup.exercises.push({
          exerciseName: exercise.exerciseName,
          sets: [{ setNumber: "1", details: { reps: 1, weight: 1 } }],
        });
      } else {
        newUserTrainingData.days[dayIndex].groups.push({
          groupName: exercise.groupName,
          exercises: [
            {
              exerciseName: exercise.exerciseName,
              sets: [{ setNumber: "1", details: { reps: 1, weight: 1 } }],
            },
          ],
        });
      }
      console.log(JSON.stringify(userTrainingData, null, 2));
      return newUserTrainingData;
    });
  };

  const handleAddSet = (dayIndex, groupIndex, exerciseIndex) => {
    
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          title="Back"
        />
        <View>
          <TextInput placeholder="New Training" className="text-3xl ml-2" />
          <View>
            {userTrainingData?.days?.map((day, dayIndex) => (
              <View key={dayIndex}>
                <Text className="text-2xl ml-4">{day.dayName}</Text>
                {day.groups?.map((group, groupIndex) => (
                  <View key={groupIndex}>
                    <Text className="text-xl ml-5">{group.groupName}</Text>
                    {group.exercises?.map((exercise, exerciseIndex) => (
                      <View key={exerciseIndex}>
                        <Text className="text-lg ml-6">
                          {exercise.exerciseName}
                        </Text>
                        {exercise.sets?.map((set, setIndex) => (
                          <View key={setIndex}>
                            <Text className="text-md ml-8">
                              Set {set.setNumber}: Reps {set.details.reps},
                              Weight {set.details.weight}
                            </Text>
                          </View>
                        ))}
                        <Button
                          title="Add Set"
                          onPress={() =>
                            handleAddSet(dayIndex, groupIndex, exerciseIndex)
                          }
                        />
                      </View>
                    ))}
                  </View>
                ))}
                <Button
                  title="Add Exercise"
                  onPress={() => handleAddExercise(dayIndex)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
