import {
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  Pressable,
  View,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { logInUser, getUserData } from "../database/Database";

import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";

export default function LogIn({ navigation }) {
  const dispatch = useDispatch();

  const validationSchema = yup
    .object()
    .shape({
      email: yup
        .string()
        .required("Introduce tu correo electronico")
        .email("Correo no valido"),
      password: yup.string().required("Introduce tu contraseña"),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handleLogIn = async (formData) => {
    const loginSuccess = await logInUser(formData.email, formData.password);
    if (loginSuccess === true) {
      fetchData(formData.email);
      navigation.navigate("TabGroup");
    } else {
    }
  };

  const fetchData = async (email) => {
    const userDataSnap = await getUserData(email);
    dispatch(setUserData(userDataSnap));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200 justify-center items-center">
      <View className="bg-gray-300 rounded-lg p-5 w-80">
        <Text className="text-4xl font-bold text-center">Inicia Sesión</Text>

        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Correo"
              inputMode="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="bg-gray-100 p-2 m-1 rounded-lg"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-xs">{errors.email.message}</Text>
        )}

        <Controller
          name="password"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Contraseña"
              inputMode="text"
              secureTextEntry={true}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="bg-gray-100 p-2 m-1 rounded-lg"
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-xs">
            {errors.password.message}
          </Text>
        )}
        <Pressable
          onPress={handleSubmit(handleLogIn)}
          className="justify-center items-center bg-gray-400 p-3 rounded-lg m-1"
        >
          <Text className="text-md font-bold">Hecho</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("TabGroup")}
          className="justify-center items-center bg-gray-400 p-3 rounded-lg m-1"
        >
          <Text className="text-md font-bold">ByPass</Text>
        </Pressable>
        <Pressable
          onPress={navigation.goBack}
          className="justify-center items-center bg-gray-400 p-3 rounded-lg m-1"
        >
          <Text className="text-md font-bold">Atrás</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
