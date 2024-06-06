import { Text, TextInput, SafeAreaView, Alert, Pressable, View, Image, Button } from 'react-native'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { logInUser } from '../database/Database'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserData, selectUserData } from '../Redux/userSlice'
import PressableView from '../components/PressableView'
import KeyboardView from '../components/KeyboardView'
import YupError from '../components/YupError'
import Divider from '../components/Divider'
import * as Haptics from 'expo-haptics'
import CustomIcon from '../components/CustomIcon'

export default function LogIn({ navigation }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)

  const [showPassword, setShowPassword] = useState(false)

  const validationSchema = yup
    .object()
    .shape({
      email: yup.string().required('Introduce tu correo electronico').email('Correo no valido'),
      password: yup.string().required('Introduce tu contraseña'),
    })
    .required()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) })

  const handleLogIn = async (formData) => {
    const loginSuccess = await logInUser(formData.email, formData.password)
    if (loginSuccess === true) {
      fetchData(formData.email)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      navigation.navigate('TabGroup')
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert('Correo o contraseña incorrectos')
    }
  }

  const fetchData = (email) => {
    dispatch(fetchUserData(email))
  }

  return (
    <SafeAreaView className="grow bg-smoke-1 dark:bg-night-1">
      <KeyboardView>
        <View className="m-2 grow justify-center">
          <Image source={require('../../assets/logos/gain-logo.png')} className="m-2 h-14 w-14" />
          <View className="my-2">
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
                  className={`my-1 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.email && 'border-vermillion'}`}
                />
              )}
            />
            {errors.email && <YupError error={errors.email} />}
            <View
              className={`my-1 flex-row items-center justify-end rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.password && 'border-vermillion'}`}
            >
              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    placeholder="Contraseña"
                    inputMode="text"
                    secureTextEntry={!showPassword}
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
                    <CustomIcon name={'visibility'} opacity={1} />
                  ) : (
                    <CustomIcon name={'visibilityOff'} opacity={0.5} />
                  )}
                </View>
              </PressableView>
            </View>

            {errors.password && <YupError error={errors.password} />}
          </View>
          <Divider />
          <PressableView onPress={handleSubmit(handleLogIn)}>
            <View className="my-4 items-center justify-center rounded-xl bg-primary-1 p-2">
              <Text className="font-rubik-medium text-xl text-smoke-1 dark:text-night-1">
                Entrar
              </Text>
            </View>
          </PressableView>

          <PressableView onPress={() => navigation.navigate('Register')}>
            <View className="items-center">
              <Text className="font-rubik-regular text-lg text-primary-2">
                ¿Eres nuevo? Crea tu cuenta
              </Text>
            </View>
          </PressableView>
        </View>
      </KeyboardView>
    </SafeAreaView>
  )
}
