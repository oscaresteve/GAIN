import React from 'react'
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
} from 'react-native'

export default function KeyboardView({ children }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flexGrow: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'center' }}>{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
