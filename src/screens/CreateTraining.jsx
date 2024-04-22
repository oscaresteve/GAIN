import {
  View,
  Text,
  SafeAreaView,
  Button,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getGainData } from "../database/Database";

export default function CreateTraining({ navigation }) {
  const [gainData, setGainData] = useState();

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

  const [selectExerciseModalShow, setSelectExerciseModalShow] = useState({
    visible: false,
    dayIndex: null,
  });

  const validationSchema = yup
    .object()
    .shape({
      trainingName: yup
        .string()
        .required("Introduce el nombre de tu entrenamiento"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const fetchData = async () => {
    const gainDataSnap = await getGainData();
    setGainData(gainDataSnap);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExercise = (dayIndex, exercise) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      const existingGroup = newUserTrainingData.days[dayIndex]?.groups.find(
        (group) => group.groupName === exercise.groupName
      );

      if (existingGroup) {
        existingGroup.exercises.push({
          exerciseName: exercise.exerciseName,
          sets: [{ setNumber: 1, details: { reps: 1, weight: 1 } }],
        });
      } else {
        newUserTrainingData.days[dayIndex]?.groups.push({
          groupName: exercise.groupName,
          exercises: [
            {
              exerciseName: exercise.exerciseName,
              sets: [{ setNumber: 1, details: { reps: 1, weight: 1 } }],
            },
          ],
        });
      }
      console.log(JSON.stringify(userTrainingData, null, 2));
      return newUserTrainingData;
    });
  };

  const handleAddSet = (dayIndex, groupIndex, exerciseIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingdata = { ...prevData };
      const sets =
        newUserTrainingdata.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets;
      const lastSet = sets[sets.length - 1];

      if (lastSet.setNumber < 10) {
        newUserTrainingdata.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets.push({
          setNumber: lastSet.setNumber + 1,
          details: { reps: 1, weight: 1 },
        });
      }
      console.log(JSON.stringify(userTrainingData, null, 2));
      return newUserTrainingdata;
    });
  };

  const handleTrainingNameChange = (value) => {
    setUserTrainingData((prevData) => ({
      ...prevData,
      trainingName: value,
    }));
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
        <Button />
        <View>
          <Controller
            name="trainingName"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                placeholder="New Training"
                inputMode="text"
                maxLength={30}
                value={value}
                onChangeText={(value) => {
                  onChange(value);
                  handleTrainingNameChange(value);
                }}
                onBlur={onBlur}
                className="text-3xl ml-2"
              />
            )}
          />
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
                  onPress={() =>
                    setSelectExerciseModalShow({
                      ...selectExerciseModalShow,
                      visible: true,
                      dayIndex: dayIndex,
                    })
                  }
                />
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={selectExerciseModalShow.visible}
                  onRequestClose={() =>
                    setSelectExerciseModalShow({
                      ...selectExerciseModalShow,
                      visible: false,
                    })
                  }
                >
                  <View className="flex-1 justify-end">
                    <ScrollView>
                      <View className="bg-gray-400 m-1 rounded-3xl">
                        {gainData?.trainingExercises?.map(
                          (exercise, exerciseIndex) => (
                            <View key={exerciseIndex}>
                              <Pressable
                                onPress={() => {
                                  handleAddExercise(
                                    selectExerciseModalShow.dayIndex,
                                    exercise
                                  );
                                  setSelectExerciseModalShow({
                                    ...selectExerciseModalShow,
                                    visible: false,
                                  });
                                }}
                              >
                                <Text className="text-xl text-center h-14">
                                  {exercise.exerciseName}
                                </Text>
                              </Pressable>
                            </View>
                          )
                        )}
                      </View>
                    </ScrollView>
                    <Pressable
                      onPress={() =>
                        setSelectExerciseModalShow({
                          ...selectExerciseModalShow,
                          visible: false,
                        })
                      }
                      className="bg-gray-400 m-1 rounded-3xl items-center"
                    >
                      <Text className="text-xl text-center h-14">
                        Hide Modal
                      </Text>
                    </Pressable>
                  </View>
                </Modal>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
