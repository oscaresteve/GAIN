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
import {
  getGainData,
  setUserTraining,
  getUserAllTrainingsNames,
} from "../database/Database";

export default function CreateTraining({ navigation }) {
  const [gainData, setGainData] = useState();
  const [userTrainingsNames, setUserTrainingsNames] = useState();

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
        .required("Introduce el nombre de tu entrenamiento")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .test(
          "is-unique",
          "Este nombre de entrenamiento ya está en uso",
          function (value) {
            return !userTrainingsNames.includes(value);
          }
        ),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const fetchData = async () => {
    setGainData(await getGainData());
    setUserTrainingsNames(await getUserAllTrainingsNames("oscar@esteve.com"));
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
          sets: [{ setNumber: 1, details: { reps: 1, weight: 5 } }],
        });
      } else {
        newUserTrainingData.days[dayIndex]?.groups.push({
          groupName: exercise.groupName,
          exercises: [
            {
              exerciseName: exercise.exerciseName,
              sets: [{ setNumber: 1, details: { reps: 1, weight: 5 } }],
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
          details: { reps: 1, weight: 5 },
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

  const handleDeleteExercise = (dayIndex, groupIndex, exerciseIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises
          .length === 1
      ) {
        newUserTrainingData.days[dayIndex].groups.splice(groupIndex, 1);
      } else {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises.splice(
          exerciseIndex,
          1
        );
      }
      return newUserTrainingData;
    });
    console.log(JSON.stringify(userTrainingData, null, 2));
  };

  const handleDeleteSet = (dayIndex, groupIndex, exerciseIndex, setIndex) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
        exerciseIndex
      ].sets.splice(setIndex, 1);
      return newUserTrainingData;
    });
    console.log(JSON.stringify(userTrainingData, null, 2));
  };

  const handleIncrementReps = (
    dayIndex,
    groupIndex,
    exerciseIndex,
    setIndex
  ) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.reps < 30
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.reps++;
      }
      return newUserTrainingData;
    });
  };

  const handleDecrementReps = (
    dayIndex,
    groupIndex,
    exerciseIndex,
    setIndex
  ) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.reps > 1
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.reps--;
      }
      return newUserTrainingData;
    });
  };

  const handleIncrementWeight = (
    dayIndex,
    groupIndex,
    exerciseIndex,
    setIndex
  ) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.weight < 300
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.weight += 5;
      }
      return newUserTrainingData;
    });
  };

  const handleDecrementWeight = (
    dayIndex,
    groupIndex,
    exerciseIndex,
    setIndex
  ) => {
    setUserTrainingData((prevData) => {
      const newUserTrainingData = { ...prevData };
      if (
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.weight > 5
      ) {
        newUserTrainingData.days[dayIndex].groups[groupIndex].exercises[
          exerciseIndex
        ].sets[setIndex].details.weight -= 5;
      }
      return newUserTrainingData;
    });
  };

  const handleSaveTraining = async () => {
    try {
      await setUserTraining("oscar@esteve.com", userTrainingData);
      navigation.navigate("MyTrainings");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Button onPress={navigation.goBack} title="Back" />
        <Button title="save" onPress={handleSubmit(handleSaveTraining)} />

        <View>
          <Controller
            name="trainingName"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                placeholder="New Training"
                inputMode="text"
                maxLength={30}
                value={value || userTrainingData.trainingName}
                onChangeText={(value) => {
                  onChange(value);
                  handleTrainingNameChange(value);
                }}
                onBlur={onBlur}
                className="text-3xl ml-2"
              />
            )}
          />
          {errors.trainingName && <Text>{errors.trainingName.message}</Text>}
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
                        <Button
                          title="Delete Exercise"
                          onPress={() =>
                            handleDeleteExercise(
                              dayIndex,
                              groupIndex,
                              exerciseIndex
                            )
                          }
                        />
                        {exercise.sets?.map((set, setIndex) => (
                          <View key={setIndex}>
                            <Text className="text-md ml-8">
                              Set {set.setNumber}: Reps {set.details.reps},
                              Weight {set.details.weight}
                            </Text>
                            <Button
                              title="Incr. Reps"
                              onPress={() =>
                                handleIncrementReps(
                                  dayIndex,
                                  groupIndex,
                                  exerciseIndex,
                                  setIndex
                                )
                              }
                            />
                            <Button
                              title="Decr. Reps"
                              onPress={() =>
                                handleDecrementReps(
                                  dayIndex,
                                  groupIndex,
                                  exerciseIndex,
                                  setIndex
                                )
                              }
                            />
                            <Button
                              title="Incr. Weight"
                              onPress={() =>
                                handleIncrementWeight(
                                  dayIndex,
                                  groupIndex,
                                  exerciseIndex,
                                  setIndex
                                )
                              }
                            />
                            <Button
                              title="Decr. Weight"
                              onPress={() =>
                                handleDecrementWeight(
                                  dayIndex,
                                  groupIndex,
                                  exerciseIndex,
                                  setIndex
                                )
                              }
                            />
                            {exercise.sets?.length === setIndex + 1 &&
                              exercise.sets.length > 1 && (
                                <Button
                                  title="Delete Set"
                                  onPress={() =>
                                    handleDeleteSet(
                                      dayIndex,
                                      groupIndex,
                                      exerciseIndex,
                                      setIndex
                                    )
                                  }
                                />
                              )}
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
                    <View className="bg-gray-400 m-1 rounded-3xl">
                      <ScrollView>
                        <Text>Bicep</Text>
                        {gainData?.trainingExercises
                          ?.sort((a, b) =>
                            a.exerciseName.localeCompare(b.exerciseName)
                          )
                          .map(
                            (exercise, exerciseIndex) =>
                              exercise.groupName === "Bicep" && (
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
                        <Text>Chest</Text>
                        {gainData?.trainingExercises
                          ?.sort((a, b) =>
                            a.exerciseName.localeCompare(b.exerciseName)
                          )
                          .map(
                            (exercise, exerciseIndex) =>
                              exercise.groupName === "Chest" && (
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
                      </ScrollView>
                    </View>

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
