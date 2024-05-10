import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import LogIn from './screens/LogIn'
import Wellcome from './screens/Wellcome'
import Home from './screens/Home'
import Register from './screens/Register'
import MyTrainings from './screens/MyTrainings'
import Profile from './screens/Profile'
import Configuration from './screens/Configuration'
import TrainingView from './screens/TrainingView'
import CreateTraining from './screens/CreateTraining'
import EditTraining from './screens/EditTraining'
import EditProfile from './screens/EditProfile'
import Progress from './screens/Progress'
import CalendarView from './screens/CalendarView'
import PersonalRecordView from './screens/PersonalRecordView'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabGroup = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="CalendarView"
        component={CalendarView}
        options={{ headerShown: false, animationEnabled: false }}
      />
      <Tab.Screen
        name="MyTrainings"
        component={MyTrainings}
        options={{ headerShown: false, animationEnabled: false }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false, animationEnabled: false }}
      />

      <Tab.Screen
        name="Progress"
        component={Progress}
        options={{ headerShown: false, animationEnabled: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false, animationEnabled: false }}
      />
    </Tab.Navigator>
  )
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Wellcome"
          component={Wellcome}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="TabGroup"
          component={TabGroup}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="TrainingView"
          component={TrainingView}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="CreateTraining"
          component={CreateTraining}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="EditTraining"
          component={EditTraining}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="Configuration"
          component={Configuration}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="PersonalRecordView"
          component={PersonalRecordView}
          options={{
            headerShown: false,
            gestureEnabled: false,
            animationEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
