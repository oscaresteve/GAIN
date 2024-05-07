import { View, Text, SafeAreaView, Button } from 'react-native'
import React from 'react'

import { useDispatch } from 'react-redux'
import { clearUserSession } from '../Redux/userSlice'

export default function Configuration({ navigation }) {
  const dispatch = useDispatch()
  const handleLogOut = () => {
    dispatch(clearUserSession())
    navigation.navigate('LogIn')
  }
  return (
    <SafeAreaView>
      <Text>Configuration</Text>
      <Button title="Back" onPress={navigation.goBack} />
      <Button title="logOut" onPress={handleLogOut} />
    </SafeAreaView>
  )
}
