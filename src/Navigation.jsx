import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LogIn from "./screens/LogIn";
import Wellcome from "./screens/Wellcome";
import Home from "./screens/Home";
import Register from "./screens/Register";
import Trainings from "./screens/Trainings";
import Profile from "./screens/Profile";
import Configuration from "./screens/Configuration";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabGroup = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Trainings"
        component={Trainings}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Configuration"
        component={Configuration}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Wellcome"
          component={Wellcome}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="TabGroup"
          component={TabGroup}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
