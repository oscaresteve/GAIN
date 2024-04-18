import { View, Text, SafeAreaView, Button } from "react-native";
import React from "react";

export default function EditTraining({ navigation }) {
  return (
    <SafeAreaView>
      <Button
        title="Back"
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View>
        <Text>EditTraining</Text>
      </View>
    </SafeAreaView>
  );
}
