import { Text, TextInput, SafeAreaView, Alert, Pressable, View, Image, Button } from 'react-native'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { logInUser } from '../database/Database'
import { useDispatch } from 'react-redux'
import { fetchUserData } from '../Redux/userSlice'
import PressableView from '../components/PressableView'
import KeyboardView from '../components/KeyboardView'
import YupError from '../components/YupError'
import Divider from '../components/Divider'
import * as Haptics from 'expo-haptics'

export default function LogIn({ navigation }) {
  const dispatch = useDispatch()

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

  const handleLoginOscar = async () => {
    const loginSuccess = await logInUser('oscar@esteve.com', 'Oscar2024@')
    if (loginSuccess === true) {
      fetchData('oscar@esteve.com')
      navigation.navigate('TabGroup')
    } else {
      Alert.alert('Correo o contraseña incorrectos')
    }
  }

  const handleLoginTest = async () => {
    const loginSuccess = await logInUser('test@test.com', 'Test111@')
    if (loginSuccess === true) {
      fetchData('test@test.com')
      navigation.navigate('TabGroup')
    } else {
      Alert.alert('Correo o contraseña incorrectos')
    }
  }

  return (
    <SafeAreaView className="grow bg-smoke-1 dark:bg-night-1">
      <KeyboardView>
        <View className="m-2 grow justify-center">
          <View className="items-start">
            <Image source={require('../../assets/logos/gain-logo.png')} className="m-2 h-14 w-14" />
          </View>
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
                  placeholder="Contraseña"
                  inputMode="text"
                  secureTextEntry={true}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className={`my-2 rounded-xl border border-smoke-3 bg-smoke-2 p-2 font-rubik-regular text-xl text-black dark:border-night-3 dark:bg-night-2 dark:text-white ${errors.password && 'border-red-500'}`}
                />
              )}
            />
            {errors.password && <YupError error={errors.password} />}
          </View>
          <Divider />
          <PressableView onPress={handleSubmit(handleLogIn)}>
            <View className="my-4 items-center justify-center rounded-xl bg-primary-1 p-2">
              <Text className="font-rubik-medium text-xl text-smoke-1 dark:text-night-1">
                Sign In
              </Text>
            </View>
          </PressableView>

          <PressableView onPress={() => navigation.navigate('Register')}>
            <View className="items-center">
              <Text className="text-md font-rubik-regular text-primary-2">
                ¿New here? ¡Create your account!
              </Text>
            </View>
          </PressableView>
        </View>
      </KeyboardView>

      <View>
        <Pressable onPress={handleLoginOscar}>
          <Text className="text-md font-bold">Login As Oscar</Text>
        </Pressable>
        <Pressable onPress={handleLoginTest}>
          <Text className="text-md font-bold">Login As Test</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
