import {
  View,
  Text,
  Button,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {} from "@hookform/resolvers";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser } from "../database/Database";

export default function Register({ navigation }) {
  const validationSchema = yup
    .object()
    .shape({
      email: yup.string().email().required(),
      password: yup.string().min(6).max(12).required(),
      repeatPassword: yup
        .string()
        .oneOf([yup.ref("password")])
        .required(),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handleRegister = async (formData) => {
    if ((await registerUser(formData.email, formData.password)) === true) {
      navigation.navigate("Main");
    } else {
      Alert.alert("Error", "User already exists, please log in");
    }
  };

  return (
    <SafeAreaView>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Text>Register</Text>

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

      <Controller
        name="repeatPassword"
        control={control}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            style={styles.TextInput}
            placeholder="Repeat your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {errors.repeatPassword && (
        <Text style={styles.error}>{errors.repeatPassword.message}</Text>
      )}

      <Button title="Done" onPress={handleSubmit(handleRegister)} />
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
