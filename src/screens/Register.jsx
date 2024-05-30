import { View, Text, Pressable, SafeAreaView, TextInput, Alert, Image } from 'react-native'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerUser, updateUserData } from '../database/Database'
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../Redux/userSlice'
import PressableView from '../components/PressableView'
import KeyboardView from '../components/KeyboardView'
import Icon from 'react-native-vector-icons/MaterialIcons'
import YupError from '../components/YupError'

export default function Register({ navigation }) {
  const dispatch = useDispatch()

  const validationSchema = yup
    .object()
    .shape({
      email: yup.string().email('Correo no valido').required('Introduce tu correo'),
      password: yup
        .string()
        .min(6, 'Debe contener al menos 6 caracteres')
        .required('Introduce una contraseña')
        .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .matches(/[0-9]/, 'Debe contener al menos un número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Debe contener al menos un carácter especial'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Repite la contraseña'),
      name: yup
        .string()
        .trim()
        .matches(/^\S+$/, 'El nombre no debe contener espacios')
        .required('Introduce tu nombre'),
      lastName: yup
        .string()
        .trim()
        .matches(/^\S+$/, 'Los apellidos no deben contener espacios')
        .required('Introduce tus apellidos'),
    })
    .required()

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(validationSchema) })

  const handleRegister = async (formData) => {
    const userData = {
      email: formData.email,
      name: formData.name,
      lastName: formData.lastName,
    }

    const registerUserSuccess = await registerUser(formData.email, formData.password)

    if (registerUserSuccess === true) {
      await updateUserData(formData.email, userData)
      dispatch(fetchUserData(userData.email))
      navigation.navigate('TabGroup')
    } else {
      Alert.alert('Ese correo ya esta en uso')
    }
  }

  return (
    <SafeAreaView className="grow bg-smoke-1 dark:bg-night-1">
      <KeyboardView>
        <View className="mx-2">
          <Pressable onPress={navigation.goBack}>
            <Icon name="chevron-left" size={50} color={'#FF2400'} />
          </Pressable>
        </View>
        <View className="mx-2 grow justify-center">
          <View className="items-start">
            <Image source={require('../../assets/logos/gain-logo.png')} className="m-2 h-14 w-14" />
          </View>
          <View className="my-2">
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
                  className={`my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.email && 'border-red-500'}`}
                />
              )}
            />
            {errors.email && <YupError error={errors.email} />}

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
                  className={`my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.password && 'border-red-500'}`}
                />
              )}
            />
            {errors.password && <YupError error={errors.password} />}
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
                  className={`my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.confirmPassword && 'border-red-500'}`}
                />
              )}
            />
            {errors.confirmPassword && <YupError error={errors.confirmPassword} />}
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
                  className={`my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.name && 'border-red-500'}`}
                />
              )}
            />
            {errors.name && <YupError error={errors.name} />}
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
                  className={`my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.lastName && 'border-red-500'}`}
                />
              )}
            />
            {errors.lastName && <YupError error={errors.lastName} />}
          </View>
          <PressableView>
            <Pressable
              onPress={handleSubmit(handleRegister)}
              className="items-center justify-center rounded-xl bg-primary-1 p-2"
            >
              <Text className="text-md font-rubik-medium text-xl text-smoke-1 dark:text-night-1">
                Hecho
              </Text>
            </Pressable>
          </PressableView>
        </View>
      </KeyboardView>
    </SafeAreaView>
  )
}
