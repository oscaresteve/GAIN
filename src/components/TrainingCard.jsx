import { View, Text, Pressable } from 'react-native'
import PressableView from './PressableView'
import React from 'react'
import moment from 'moment'
import Divider from '../components/Divider'

export default function TrainingCard({ navigation, userTrainingData }) {
  return (
    <PressableView
      onPress={() => {
        navigation.navigate('TrainingView', {
          userTrainingData: userTrainingData,
        })
      }}
    >
      <View
        className={`m-1 rounded-xl border bg-smoke-2 p-2 dark:bg-night-2 ${userTrainingData.primary ? 'border-primary-1' : 'border-smoke-3 dark:border-night-3'}`}
      >
        <Text className="m-1 font-rubik-regular text-xl dark:text-white">
          {userTrainingData.trainingName}
        </Text>
        <Divider />
        <View className="m-2">
          {userTrainingData.days?.map(
            (day, dayIndex) =>
              day.groups.length > 0 && (
                <View key={dayIndex} className="">
                  <Text className="font-rubik-regular text-xl opacity-80 dark:text-white">
                    {moment().day(day.day).format('dddd')}
                  </Text>
                  <View className="ml-1">
                    <Text className="text-md font-rubik-regular opacity-50 dark:text-white">
                      {day.groups.map((group) => group.groupName).join(', ')}
                    </Text>
                  </View>
                </View>
              ),
          )}
        </View>
      </View>
    </PressableView>
  )
}
