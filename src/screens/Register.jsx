import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser, setUserInfo } from "../database/Database";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { onAuthStateChanged } from "firebase/auth/cordova";

export default function Register({ navigation }) {
  const [dateBirthModalShow, setdateBirthModalShow] = useState(false);
  const [selectedDateBirth, setSelectedDateBirth] = useState();
  const [genderModalShow, setGenderModalShow] = useState(false);
  const [selectedGender, setSelectedGendre] = useState();
  const validationSchema = yup
    .object()
    .shape({
      email: yup
        .string()
        .email("Correo no valido")
        .required("Introduce tu correo"),
      password: yup
        .string()
        .min(6, "Debe contener al menos 6 caracteres")
        .required("Introduce una contraseña")
        .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
        .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
        .matches(/[0-9]/, "Debe contener al menos un número")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Debe contener al menos un carácter especial"
        ),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
        .required("Repite la contraseña"),
      name: yup.string().required("Introduce tu nombre"),
      lastName: yup.string().required("Introduce tus apellidos"),
      dateBirth: yup.date().required("Selecciona tu fecha de nacimiento"),
      gender: yup.string().required("Selecciona tu género"),
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
      await setUserInfo(
        formData.email,
        formData.name,
        formData.lastName,
        formData.dateBirth,
        formData.gender
      );
      navigation.navigate("TabGroup");
      console.log(formData);
    } else {
      Alert.alert("Ese correo ya esta en uso");
    }
  };

  return (
    <SafeAreaView className="bg-gray-200 h-full justify-center items-center">
      <View className="bg-gray-300 rounded-lg p-5 w-80">
        <Text className="text-4xl font-bold text-center">Crea tu cuenta</Text>
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="E-mail"
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
              placeholder="Password"
              inputMode="text"
              secureTextEntry={true}
              maxLength={12}
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
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Confirm password"
              inputMode="text"
              secureTextEntry={true}
              maxLength={12}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="bg-gray-100 p-2 m-1 rounded-lg"
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </Text>
        )}
        <Controller
          name="name"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Nombre"
              inputMode="text"
              maxLength={20}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="bg-gray-100 p-2 m-1 rounded-lg"
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 text-xs">{errors.name.message}</Text>
        )}
        <Controller
          name="lastName"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Apellidos"
              inputMode="text"
              maxLength={40}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              className="bg-gray-100 p-2 m-1 rounded-lg"
            />
          )}
        />
        {errors.lastName && (
          <Text className="text-red-500 text-xs">
            {errors.lastName.message}
          </Text>
        )}

        <TextInput
          placeholder="Fecha de nacimiento"
          editable={false}
          onTouchStart={() => setdateBirthModalShow(!dateBirthModalShow)}
          value={selectedDateBirth}
          className="bg-gray-100 p-2 m-1 rounded-lg"
        />
        {errors.dateBirth && (
          <Text className="text-red-500 text-xs">
            {errors.dateBirth.message}
          </Text>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={dateBirthModalShow}
          onRequestClose={() => !dateBirthModalShow}
        >
          <View className="flex-1 justify-end">
            <View className="bg-gray-400 m-1 rounded-3xl">
              <Controller
                name="dateBirth"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date(1950, 0, 1)}
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      onChange(selectedDate);
                      setSelectedDateBirth(selectedDate.toLocaleDateString());
                    }}
                  />
                )}
              />
            </View>
            <Pressable
              onPress={() => setdateBirthModalShow(!dateBirthModalShow)}
              className="bg-gray-400 m-1 rounded-3xl items-center"
            >
              <Text className="text-xl text-center h-14">Hide Modal</Text>
            </Pressable>
          </View>
        </Modal>

        <TextInput
          placeholder="Genero"
          editable={false}
          onTouchStart={() => setGenderModalShow(!genderModalShow)}
          value={selectedGender}
          className="bg-gray-100 p-2 m-1 rounded-lg"
        />
        {errors.gender && (
          <Text className="text-red-500 text-xs">{errors.gender.message}</Text>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={genderModalShow}
          onRequestClose={() => !genderModalShow}
        >
          <View className="flex-1 justify-end">
            <View className="bg-gray-400 m-1 rounded-3xl">
              <Controller
                name="gender"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Picker selectedValue={value} onValueChange={onChange}>
                    <Picker.Item label="Hombre" value="man" />
                    <Picker.Item label="Mujer" value="woman" />
                  </Picker>
                )}
              />
            </View>
            <Pressable
              onPress={() => setGenderModalShow(!genderModalShow)}
              className="bg-gray-400 m-1 rounded-3xl items-center"
            >
              <Text className="text-xl text-center h-14">Hide Modal</Text>
            </Pressable>
          </View>
        </Modal>

        <Pressable
          onPress={handleSubmit(handleRegister)}
          className="justify-center items-center bg-gray-400 p-3 rounded-lg m-1"
        >
          <Text className="text-md font-bold">Hecho</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          className="justify-center items-center bg-gray-400 p-3 rounded-lg m-1"
        >
          <Text className="text-md font-bold">Atrás</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
