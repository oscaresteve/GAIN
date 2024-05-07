import { View, Text, Button, SafeAreaView, TextInput, Image } from 'react-native'
import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { selectUserData, saveUserData } from '../Redux/userSlice'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import * as ImagePicker from 'expo-image-picker'

export default function EditProfile({ navigation }) {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const [profilePic, setProfilePic] = useState(userData.profilePic)

  const validationSchema = yup
    .object()
    .shape({
      name: yup.string().required('Introduce tu nombre'),
      lastName: yup.string().required('Introduce tus apellidos'),
    })
    .required()

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(validationSchema) })

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

  return (
    <SafeAreaView>
      <Button title="Back" onPress={navigation.goBack} />
      <View>
        <Button title="Pick an image from camera roll" onPress={handleSelectProfilePic} />
      </View>
      <Image source={{ uri: profilePic }} className="w-48 h-48" />
      <Text>Name: </Text>
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
          />
        )}
      />
      {errors.name && <Text className="text-red-500 text-xs">{errors.name.message}</Text>}
      <Text>Last Name: </Text>
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
          />
        )}
      />
      {errors.lastName && <Text className="text-red-500 text-xs">{errors.lastName.message}</Text>}

      <Button title="save" onPress={handleSubmit(handleSave)} />
    </SafeAreaView>
  )
}
