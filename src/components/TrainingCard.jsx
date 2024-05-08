import { View, Text, Pressable } from 'react-native'
import React from 'react'
import moment from 'moment'

export default function TrainingCard({ navigation, userTrainingData }) {
  return (
    <View className="mx-4 mb-2 p-2 bg-white rounded-md shadow-sm">
      <Pressable
        onPress={() => {
          navigation.navigate('TrainingView', {
            userTrainingData: userTrainingData,
          })
        }}
      >
        <Text className="text-xl font-bold">{userTrainingData.trainingName}</Text>
        <View className="p-1 bg-gray-50 rounded-md shadow-sm">
          {userTrainingData.days?.map((day, dayIndex) => (
            <View key={dayIndex} className="mb-1">
              <Text className="font-medium text-xl">{moment(day.day, 'd').format('dddd')}</Text>
              {day.groups?.map((group, groupIndex) => (
                <View key={groupIndex} className="ml-1">
                  <Text className="">{group.groupName}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Pressable>
    </View>
  )
}
