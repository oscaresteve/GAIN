import { View, ScrollView, Alert, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearUserSession } from '../Redux/userSlice'
import PressableView from '../components/PressableView'
import AppBar, { useAppBarHeight } from '../components/AppBar'
import CustomIcon from '../components/CustomIcon'

export default function Configuration({ navigation }) {
  const dispatch = useDispatch()

  const noSaveAlert = () =>
    Alert.alert(
      '¿Cerrar sesión?',
      'Deberas iniciar sesión de nuevo cuando quieras volver a acceder',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { text: 'Cerrar sesión', onPress: () => handleLogOut(), style: 'destructive' },
      ],
    )

  const handleLogOut = () => {
    dispatch(clearUserSession())
    navigation.navigate('LogIn')
  }
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY > 0 && !showScrollToTop) {
      setShowScrollToTop(true)
    } else if (offsetY === 0 && showScrollToTop) {
      setShowScrollToTop(false)
    }
  }
  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

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
          <View className="my-2 items-center">
            <PressableView onPress={noSaveAlert}>
              <Text className="font-rubik-regular text-2xl text-red-500">Cerrar sesión</Text>
            </PressableView>
          </View>
        </View>
      </ScrollView>
      <AppBar label={'Configuración'} backButton={true} onBack={() => navigation.goBack()} />
      <ScrollToTop />
    </View>
  )
}
