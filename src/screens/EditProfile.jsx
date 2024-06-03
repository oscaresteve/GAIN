import { View, Text, Alert, TextInput, Image, ScrollView } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUserData, saveUserData } from '../Redux/userSlice'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'
import Divider from '../components/Divider'
import AppBar, { useAppBarHeight } from '../components/AppBar'
import YupError from '../components/YupError'

export default function EditProfile({ navigation }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const [profilePic, setProfilePic] = useState(userData.profilePic)
  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const initialUserData = useRef(userData)

  const validationSchema = yup
    .object()
    .shape({
      name: yup
        .string()
        .trim()
        .matches(/^[A-Z][a-z]{2,}$/, 'Introduce un nombre válido')
        .required('Introduce tu nombre'),
      lastName: yup
        .string()
        .trim()
        .matches(/^[A-Z][a-z]{2,}$/, 'Introduce apellidos válidos')
        .required('Introduce tus apellidos'),
    })
    .required()

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: userData })

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY > 0 && !showScrollToTop) {
      setShowScrollToTop(true)
    } else if (offsetY === 0 && showScrollToTop) {
      setShowScrollToTop(false)
    }
  }

  const ScrollToTop = () => {
    if (showScrollToTop) {
      return (
        <View className="absolute right-0" style={{ marginTop: useAppBarHeight() }}>
          <PressableView
            onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
          >
            <View className="m-4 rounded-full border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2">
              <CustomIcon name={'keyboardDoubleArrowUp'} size={40} color={'white'} />
            </View>
          </PressableView>
        </View>
      )
    }
  }

  const handleSelectProfilePic = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled) {
      setProfilePic(result.assets[0].uri)
    }
  }

  const handleSave = async (formData) => {
    const newUserData = JSON.parse(JSON.stringify(userData))
    newUserData.name = formData.name
    newUserData.lastName = formData.lastName
    newUserData.profilePic = profilePic
    dispatch(saveUserData(userData.email, newUserData))
    navigation.navigate('Profile')
  }

  const noSaveAlert = () =>
    Alert.alert('Are you sure?', 'This cant be reverted', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Delete', onPress: () => navigation.goBack(), style: 'destructive' },
    ])

  const checkIfModified = () => {
    const formData = watch()
    if (
      formData.name !== initialUserData.current.name ||
      formData.lastName !== initialUserData.current.lastName ||
      profilePic !== initialUserData.current.profilePic
    ) {
      noSaveAlert()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollIndicatorInsets={{
          top: useAppBarHeight(),
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        <View className="mx-2 my-2 grow pb-20" style={{ paddingTop: useAppBarHeight() }}>
          <View className="items-center">
            <View className="m-2 aspect-square h-36 overflow-hidden rounded-full">
              <Image source={{ uri: profilePic }} className="h-full w-full" />
            </View>
            <PressableView onPress={handleSelectProfilePic}>
              <Text className="font-rubik-regular text-2xl text-primary-1">Change photo</Text>
            </PressableView>
          </View>

          <Controller
            name="name"
            control={control}
            defaultValue={userData.name}
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
            defaultValue={userData.lastName}
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
      </ScrollView>
      <ScrollToTop />
      <AppBar
        label={'Edit Profile'}
        backButton={true}
        onBack={checkIfModified}
        buttons={
          <PressableView onPress={handleSubmit(handleSave)}>
            <Text className="font-rubik-regular text-2xl text-primary-1">Save</Text>
          </PressableView>
        }
      />
    </View>
  )
}
