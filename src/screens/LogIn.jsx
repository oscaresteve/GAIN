import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Button,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUser } from "../database/Database";

import CustomTextInput from "../components/CustomTextInput";

export default function LogIn({ navigation }) {
  const { control, handleSubmit } = useForm();
  const handleLogIn = async (formData) => {
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
      <CustomTextInput control={control} placeholder={"email"} name={"email"} />
      <CustomTextInput
        control={control}
        placeholder={"password"}
        name={"password"}
      />
      <Button title="Log In" onPress={handleSubmit(handleLogIn)} />
      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text>¿You dont have an account? Click here and register!</Text>
      </Pressable>
    </SafeAreaView>
  );
}
