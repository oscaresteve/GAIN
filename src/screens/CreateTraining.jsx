import { View, Text, SafeAreaView, Button } from "react-native";
import React from "react";

export default function CreateTraining({ navigation }) {
  return (
    <SafeAreaView>
      <View>
        <Button onPress={() => {navigation.goBack()}} title="Back" />
        <Text>CreateTraining</Text>
      </View>
    </SafeAreaView>
  );
}
