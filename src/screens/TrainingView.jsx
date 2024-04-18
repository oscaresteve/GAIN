import { View, Text, ScrollView, Button } from "react-native";
import React from "react";

export default function Training({ navigation, route }) {
  const { userTrainingData } = route.params;

  return (
    <ScrollView>
      <Button
        title="Edit"
        onPress={() => {
          navigation.navigate("EditTraining");
        }}
      />
      <View key={userTrainingData?.trainingName}>
        <Text>{userTrainingData?.trainingName}</Text>

        {userTrainingData?.days.map((day, dayIndex) => (
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
    </ScrollView>
  );
}
