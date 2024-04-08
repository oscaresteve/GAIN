import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

export default function StyledTextInput({ control, name, placeholder }) {
  return (
    <View>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
            returnKeyType="done"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 15,
    borderRadius: 10,
  },
});
