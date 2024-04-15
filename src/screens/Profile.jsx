import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import AppBar from "../components/AppBar";

export default function Profile() {
  return (
    <SafeAreaView>
      <AppBar />
      <Text>Profile</Text>
    </SafeAreaView>
  );
}
