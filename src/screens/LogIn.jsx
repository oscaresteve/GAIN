import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Button,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { logInUser } from "../database/Database";

export default function LogIn({ navigation }) {
  const validationSchema = yup
    .object()
    .shape({
      email: yup.string().required().email(),
      password: yup.string().required(),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handleLogIn = async (formData) => {
    if ((await logInUser(formData.email, formData.password)) === true) {
      navigation.navigate("Main");
    } else {
      Alert.alert("Error", "User or Email incorrect");
    }
  };

  return (
    <SafeAreaView>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text>LogIn</Text>

      <Controller
        name="email"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            style={styles.TextInput}
            placeholder="E-mail"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        name="password"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Button title="Done" onPress={handleSubmit(handleLogIn)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 15,
    borderRadius: 10,
  },
  error: {
    color: "#ff0000",
    fontSize: 12,
  },
});
