import 'react-native-gesture-handler'
import Navigation from './src/Navigation'
import { Provider } from 'react-redux'
import { store, persistor } from './src/Redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  )
}
