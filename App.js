import 'react-native-gesture-handler'
import Navigation from './src/Navigation'
import { Provider } from 'react-redux'
import { store, persistor } from './src/Redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { useFonts } from 'expo-font'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'

export default function App() {
  const [fontsLoaded] = useFonts({
    rubik: require('./assets/fonts/Rubik-Regular.ttf'),
  })
  const colorScheme = useColorScheme()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </PersistGate>
    </Provider>
  )
}
