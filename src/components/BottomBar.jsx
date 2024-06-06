import { View, Text } from 'react-native'
import React from 'react'
import { BlurView } from 'expo-blur'

const height = 90

export const useBottomBarHeight = () => {
  return height
}

export default function BottomBar({ children }) {
  return (
    <BlurView
      intensity={70}
      style={{ height: height }}
      className="absolute bottom-0 w-full flex-row justify-around border-t border-t-smoke-3 p-4 dark:border-t-night-3 "
    >
      {children}
    </BlurView>
  )
}
