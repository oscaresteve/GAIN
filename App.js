import 'react-native-gesture-handler'
import Navigation from './src/Navigation'
import { Provider } from 'react-redux'
import { store, persistor } from './src/Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
    'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
    'Rubik-Italic': require('./assets/fonts/Rubik-Italic.ttf'),
  })

  const colorScheme = useColorScheme()

  if (!fontsLoaded) {
    return null
  }

  SplashScreen.hideAsync()

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </PersistGate>
    </Provider>
  )
}
