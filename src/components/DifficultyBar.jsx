import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function DifficultyBar({ value = 1, maxValue = 10, height = 5, width = 50 }) {
  const percentage = value >= maxValue ? 100 : (value / maxValue) * 100
  let barColor

  if (percentage <= 25) {
    barColor = 'green'
  } else if (percentage <= 50) {
    barColor = 'yellow'
  } else if (percentage <= 75) {
    barColor = 'orange'
  } else {
    barColor = 'red'
  }

  return (
    <View style={[styles.backgroundBar, { height, width }]} className="bg-smoke-3 dark:bg-night-3">
      <View
        style={[styles.foregroundBar, { width: `${percentage}%`, backgroundColor: barColor }]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  backgroundBar: {
    borderRadius: '100%',
    overflow: 'hidden',
  },
  foregroundBar: {
    borderRadius: '100%',
    height: '100%',
  },
})
