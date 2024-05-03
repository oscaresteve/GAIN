import { View, Text, SafeAreaView, Button } from "react-native";
import React from "react";
import AppBar from "../components/AppBar";

import { useSelector, useDispatch } from "react-redux";
import { selectUserData, clearUserSession } from "../Redux/userSlice";

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const handleLogOut = () => {
    dispatch(clearUserSession());
    navigation.navigate("LogIn");
  };
  return (
    <SafeAreaView>
      <AppBar />
      <Text>Email: {userData?.email}</Text>
      <Button title="logOut" onPress={handleLogOut} />
    </SafeAreaView>
  );
}
