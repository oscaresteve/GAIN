import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import AppBar from "../components/AppBar";

import { useSelector } from "react-redux";
import { selectUserData } from "../Redux/userSlice";

export default function Profile() {
  const userData = useSelector(selectUserData);

  return (
    <SafeAreaView>
      <AppBar />
      <Text>Email: {userData?.email}</Text>
    </SafeAreaView>
  );
}
