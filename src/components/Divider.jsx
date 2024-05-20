import React from 'react'
import { View, StyleSheet } from 'react-native'

const Divider = ({ height = 1, direction = 'horizontal', bg = 'bg-smoke-3 dark:bg-night-3' }) => {
  const style = [styles.divider, { height }]

  if (direction === 'vertical') {
    style.push(styles.vertical)
  }

  return <View style={style} className={bg} />
}

const styles = StyleSheet.create({
  divider: {
    width: '75%',
    alignSelf: 'center',
  },
  vertical: {
    width: 1,
    height: '75%',
    alignSelf: 'center',
  },
})

export default Divider
