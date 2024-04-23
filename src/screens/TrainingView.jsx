import { View, Text, ScrollView, Button } from "react-native";
import React from "react";
import { deleteUserTraining } from "../database/Database";

export default function Training({ navigation, route }) {
  const { userTrainingData } = route.params;

  const handleDeleteTraining = async () => {
    try {
      await deleteUserTraining(
        "oscar@esteve.com",
        userTrainingData.trainingName
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <Button
        title="Edit"
        onPress={() =>
          navigation.navigate("EditTraining", {
            userTrainingData: userTrainingData,
          })
        }
      />
      <Button title="Delete" onPress={handleDeleteTraining} />
      <View key={userTrainingData?.trainingName}>
        <Text>{userTrainingData?.trainingName}</Text>

        {userTrainingData?.days?.map((day, dayIndex) => (
          <View key={dayIndex}>
            <Text>{day.dayName}</Text>

            {day.groups?.map((group, groupIndex) => (
              <View key={groupIndex}>
                <Text>{group.groupName}</Text>

                {group.exercises?.map((exercise, exerciseIndex) => (
                  <View key={exerciseIndex}>
                    <Text>{exercise.exerciseName}</Text>

                    {exercise.sets?.map((set, setIndex) => (
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
    </ScrollView>
  );
}
