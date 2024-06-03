import { View, Text, Pressable, SafeAreaView, TextInput, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerUser, updateUserData } from '../database/Database'
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../Redux/userSlice'
import PressableView from '../components/PressableView'
import KeyboardView from '../components/KeyboardView'
import CustomIcon from '../components/CustomIcon'
import YupError from '../components/YupError'
import * as Haptics from 'expo-haptics'

export default function Register({ navigation }) {
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      await updateUserData(formData.email, userData)
      dispatch(fetchUserData(userData.email))
      navigation.navigate('TabGroup')
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Ese correo ya esta en uso')
    }
  }

  return (
    <SafeAreaView className="grow bg-smoke-1 dark:bg-night-1">
      <KeyboardView>
        <View className="m-4">
          <PressableView onPress={navigation.goBack}>
            <CustomIcon name="arrowBack" size={40} color={'white'} />
          </PressableView>
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
                  placeholder="Email"
                  inputMode="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className={`my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.email && 'border-red-500'}`}
                />
              )}
            />
            {errors.email && <YupError error={errors.email} />}

            <View
              className={`my-2 flex-row items-center justify-end rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.password && 'border-red-500'}`}
            >
              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    placeholder="Contraseña"
                    inputMode="text"
                    secureTextEntry={!showPassword}
                    maxLength={12}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    className="grow font-rubik-regular text-xl dark:text-white"
                  />
                )}
              />
              <PressableView onPress={() => setShowPassword(!showPassword)}>
                <View className="mx-2">
                  {showPassword ? (
                    <CustomIcon name={'visibility'} color={'white'} />
                  ) : (
                    <CustomIcon name={'visibilityOff'} color={'white'} />
                  )}
                </View>
              </PressableView>
            </View>
            {errors.password && <YupError error={errors.password} />}
            <View
              className={`my-2 flex-row items-center justify-end rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.password && 'border-red-500'}`}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    placeholder="Repita su contraseña"
                    inputMode="text"
                    secureTextEntry={!showConfirmPassword}
                    maxLength={12}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    className="grow font-rubik-regular text-xl dark:text-white"
                  />
                )}
              />
              <PressableView onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <View className="mx-2">
                  {showConfirmPassword ? (
                    <CustomIcon name={'visibility'} color={'white'} />
                  ) : (
                    <CustomIcon name={'visibilityOff'} color={'white'} />
                  )}
                </View>
              </PressableView>
            </View>

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
          <PressableView onPress={handleSubmit(handleRegister)}>
            <View className="items-center justify-center rounded-xl bg-primary-1 p-2">
              <Text className="text-md font-rubik-medium text-xl text-smoke-1 dark:text-night-1">
                Hecho
              </Text>
            </View>
          </PressableView>
        </View>
      </KeyboardView>
    </SafeAreaView>
  )
}
