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
import ProgressView from './screens/ProgressView'
import { StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'
import TrainingDayView from './screens/TrainingDayView'
import ExerciseInfo from './screens/ExerciseInfo'

import CustomIcon from './components/CustomIcon'
import { Image, View } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUserData } from './Redux/userSlice'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabGroup = () => {
  const userData = useSelector(selectUserData)
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { position: 'absolute', borderTopWidth: 0 },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            className="border-t border-t-smoke-3 dark:border-t-night-3"
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tab.Screen
        name="CalendarView"
        component={CalendarView}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <CustomIcon name="calendarMonthFILL" color={color} size={size} />
            ) : (
              <CustomIcon name="calendarMonth" color={color} size={size} />
            ),
          tabBarActiveTintColor: '#FF2400',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={Progress}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <CustomIcon name="analyticsFILL" color={color} size={size} />
            ) : (
              <CustomIcon name="analytics" color={color} size={size} />
            ),
          tabBarActiveTintColor: '#FF2400',
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <CustomIcon name="homeFILL" color={color} size={size} />
            ) : (
              <CustomIcon name="home" color={color} size={size} />
            ),
          tabBarActiveTintColor: '#FF2400',
        }}
      />
      <Tab.Screen
        name="MyTrainings"
        component={MyTrainings}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <CustomIcon name="assignmentFILL" color={color} size={size} />
            ) : (
              <CustomIcon name="assignment" color={color} size={size} />
            ),
          tabBarActiveTintColor: '#FF2400',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Image
                source={{ uri: userData?.profilePic }}
                style={{
                  aspectRatio: 1,
                  height: size,
                  borderRadius: '100%',
                  borderWidth: '2px',
                  borderColor: color,
                }}
              />
            ) : (
              <Image
                source={{ uri: userData?.profilePic }}
                style={{
                  aspectRatio: 1,
                  height: size,
                  borderRadius: '100%',
                  borderWidth: '2px',
                  borderColor: color,
                }}
              />
            ),
          tabBarActiveTintColor: '#FF2400',
        }}
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
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
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
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="CreateTraining"
          component={CreateTraining}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="EditTraining"
          component={EditTraining}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
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
          name="ProgressView"
          component={ProgressView}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="TrainingDayView"
          component={TrainingDayView}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="ExerciseInfo"
          component={ExerciseInfo}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animationEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
