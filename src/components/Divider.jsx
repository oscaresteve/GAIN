import React from 'react'
import { View, StyleSheet } from 'react-native'

export default Divider = ({
  height = 1,
  direction = 'horizontal',
  bg = 'bg-smoke-3 dark:bg-night-3',
  width = '95%',
}) => {
  if (direction === 'horizontal') {
    return (
      <View
        style={{ height: height, width: width, alignSelf: 'center', borderRadius: 10 }}
        className={bg}
      />
    )
  } else if (direction === 'vertical') {
    return (
      <View
        style={{ width: height, height: width, alignSelf: 'center', borderRadius: 10 }}
        className={bg}
      />
    )
  }
}
