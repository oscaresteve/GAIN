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

import { getUser } from "../database/Database";

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
    console.log(formData);
    const userSnap = await getUser(formData.email);
    if (userSnap != null) {
      if (userSnap.password == formData.password) {
        console.log(">>> LOGIN SUCCESS");
        navigation.navigate("TabGroup");
      } else {
        console.log(">>> PASSWORD INCORRECT");
        Alert.alert("Error", "User or Email incorrect");
      }
    } else {
      console.log(">>> USER NOT FOUND");
      Alert.alert("Error", "User or Email incorrect");
    }
  };

  return (
    <SafeAreaView>
      <Text>LogIn</Text>

      <Controller
        name="email"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Controller
        name="password"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}

      <Button title="Log In" onPress={handleSubmit(handleLogIn)} />

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text>¿You dont have an account? Click here and register!</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 15,
    borderRadius: 10,
  },
});
