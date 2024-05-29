import React, { useRef, useState } from 'react'
import { View, Text, ScrollView, Image, Pressable } from 'react-native'
import { useSelector } from 'react-redux'
import { selectUserData, selectUserAllTrainingDaysData } from '../Redux/userSlice'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import PressableView from '../components/PressableView'
import CustomIcon from '../components/CustomIcon'
import Divider from '../components/Divider'
import AppBar, { useAppBarHeight } from '../components/AppBar'
import ProgressBar from '../components/ProgressBar'

const Profile = ({ navigation }) => {
  const userData = useSelector(selectUserData)
  const userAllTrainingDaysData = useSelector(selectUserAllTrainingDaysData)
  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [view, setView] = useState('achievements')

  console.log(JSON.stringify(userData.userStats))

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (offsetY > 0 && !showScrollToTop) {
      setShowScrollToTop(true)
    } else if (offsetY === 0 && showScrollToTop) {
      setShowScrollToTop(false)
    }
  }

  const ScrollToTop = () => {
    if (showScrollToTop) {
      return (
        <View className="absolute right-0" style={{ marginTop: useAppBarHeight() }}>
          <PressableView>
            <Pressable
              onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
              className="m-4 rounded-full border border-smoke-3 bg-smoke-2 dark:border-night-3 dark:bg-night-2"
            >
              <CustomIcon name={'keyboard-double-arrow-up'} size={40} color={'white'} />
            </Pressable>
          </PressableView>
        </View>
      )
    }
  }

  const msToTime = (ms) => {
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const seconds = Math.floor((ms / 1000) % 60)

    const hoursStr = hours > 0 ? ` ${hours}h` : ''
    const minutesStr = minutes > 0 ? ` ${minutes}m` : ''
    const secondsStr = ` ${seconds}s`

    return `${hoursStr}${minutesStr}${secondsStr}`
  }

  const toRoman = (num) => {
    const lookup = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    }
    let roman = ''
    for (let i in lookup) {
      while (num >= lookup[i]) {
        roman += i
        num -= lookup[i]
      }
    }
    return roman
  }

  const formatNumber = (num) => {
    return num.toLocaleString('en-US')
  }

  const Stats = () => {
    /* let trainingsFinished = 0
    let trainingsNotFinished = 0

    userAllTrainingDaysData.forEach((day) => {
      if (day.done) {
        trainingsFinished += 1
      } else if (!day.done) {
        trainingsNotFinished += 1
      }
    }) */

    return (
      <View>
        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Exercises</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.userTotalExercisesNumber || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Sets</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.userTotalSetsNumber || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Reps</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.userTotalRepsNumber || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Weight lifted</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.userTotalWeightNumber || 0)} kg
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Time trained</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {msToTime(userData.userStats.userTotalTrainingTime || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Chest exercises</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberChest || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Bicep exercises</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberBicep || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Tricep exercises</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberTricep || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Shoulder exercises</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberShoulder || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Back exercises</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberBack || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Legs exercises</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberLegs || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Trainings finished</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.trainingsFinished || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Trainings not finished</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {formatNumber(userData.userStats.trainingsNotFinished || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-custom text-xl dark:text-white">Average Training Time</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-custom text-xl dark:text-white">
            {msToTime(
              userData.userStats.userTotalTrainingTime / userData.userStats.trainingsFinished || 0,
            )}
          </Text>
        </View>
      </View>
    )
  }

  const Achievements = () => {
    const AchievementCard = ({ title, achieved, description, target, current, unit }) => (
      <View
        className={`my-2 flex-row justify-end rounded-xl bg-smoke-2 p-2 dark:bg-night-2 ${
          achieved ? 'border border-green-500' : 'border border-smoke-3 dark:border-night-3'
        }`}
      >
        <View className="grow">
          <View className="mb-4">
            <Text className="font-custom text-2xl dark:text-white">{title}</Text>
            {unit === 'time' ? (
              <Text className="text-xxl font-custom dark:text-white">
                {description} ({msToTime(current || 0)} / {msToTime(target || 0)})
              </Text>
            ) : (
              <Text className="text-xxl font-custom dark:text-white">
                {description} ({formatNumber(current || 0)} {unit} / {formatNumber(target || 0)}{' '}
                {unit})
              </Text>
            )}
          </View>
          <View>
            <ProgressBar current={current} target={target} height={6} />
          </View>
        </View>
      </View>
    )

    const generateLevels = (base, initialIncrement, factor, count) => {
      let levels = []
      let increment = initialIncrement

      for (let i = 0; i < count; i++) {
        const roundedLevel = Math.round(base / 10) * 10
        levels.push(roundedLevel)

        base += increment
        increment *= factor
      }

      return levels
    }

    const achievementsData = {
      userTotalWeightNumber: [
        {
          title: 'Brute Force',
          description: 'Lift weight',
          unit: 'kg',
          levels: generateLevels(10000, 5000, 1.1, 50),
        },
      ],
      userTotalRepsNumber: [
        {
          title: 'Repetition King',
          description: 'Complete reps',
          unit: 'reps',
          levels: generateLevels(1000, 500, 1.1, 50),
        },
      ],
      userTotalTrainingTime: [
        {
          title: 'Training Time',
          description: 'Train for',
          unit: 'time',
          levels: generateLevels(3600000, 3600000, 1.1, 50),
        },
      ],
      userTotalSetsNumber: [
        {
          title: 'Set Master',
          description: 'Complete sets',
          unit: 'sets',
          levels: generateLevels(100, 50, 1.1, 50),
        },
      ],
      userTotalExercisesNumber: [
        {
          title: 'Exercise Enthusiast',
          description: 'Complete exercises',
          unit: 'exercises',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberBicep: [
        {
          title: 'Bicep Enjoyer',
          description: 'Complete bicep exercises',
          unit: 'exercises',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberTricep: [
        {
          title: 'Tricep Achiever',
          description: 'Complete tricep exercises',
          unit: 'exercises',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberChest: [
        {
          title: 'Chest Champion',
          description: 'Complete chest exercises',
          unit: 'exercises',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberBack: [
        {
          title: 'Back Beast',
          description: 'Complete back exercises',
          unit: 'exercises',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberShoulder: [
        {
          title: 'Shoulder Specialist',
          description: 'Complete shoulder exercises',
          unit: 'exercises',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberLegs: [
        {
          title: 'Legs Legend',
          description: 'Complete legs exercises',
          unit: 'exercises',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      trainingsFinished: [
        {
          title: 'Training Terminator',
          description: 'Finish training sessions',
          unit: 'sessions',
          levels: generateLevels(50, 10, 1.1, 50),
        },
      ],
    }

    const checkAchievements = (userStats) => {
      let achievements = []

      for (const category in achievementsData) {
        achievementsData[category].forEach((achievement) => {
          const achievedLevels = achievement.levels.filter((level) => userStats[category] >= level)
          if (achievedLevels.length > 0) {
            achievedLevels.forEach((level, index) => {
              achievements.push({
                title: `${achievement.title} ${index > 0 ? toRoman(index + 1) : ''}`,
                achieved: true,
                description: `${achievement.description}`,
                target: level,
                current: userStats[category],
                unit: achievement.unit,
              })
            })
          }
          // Logros por completar
          const nextLevel = achievement.levels.find((level) => userStats[category] < level)
          const nextLevelIndex = achievement.levels.indexOf(nextLevel)
          if (nextLevel !== undefined) {
            achievements.push({
              title: `${achievement.title} ${nextLevelIndex > 0 ? toRoman(nextLevelIndex + 1) : ''}`,
              description: `${achievement.description}`,
              achieved: false,
              target: nextLevel,
              current: userStats[category],
              unit: achievement.unit,
            })
          } else if (achievedLevels.length === 0) {
            // Incluir el primer nivel si no se ha alcanzado ningún nivel aún
            achievements.push({
              title: `${achievement.title}`,
              description: `${achievement.description}`,
              achieved: false,
              target: achievement.levels[0],
              current: userStats[category],
              unit: achievement.unit,
            })
          }
        })
      }

      return achievements
    }

    const achievements = checkAchievements(userData.userStats)
    const completedAchievements = achievements.filter((achievement) => achievement.achieved).length

    return (
      <View>
        <View className="my-2">
          {achievements.map((achievement, index) => {
            if (!achievement.achieved) {
              return (
                <AchievementCard
                  key={index}
                  title={achievement.title}
                  description={achievement.description}
                  achieved={achievement.achieved}
                  current={
                    achievement.current >= achievement.target
                      ? achievement.target
                      : achievement.current
                  }
                  target={achievement.target}
                  unit={achievement.unit}
                />
              )
            }
          })}
        </View>
        <Text className="font-custom text-2xl dark:text-white">
          Completed ({completedAchievements})
        </Text>
        <Divider />
        <View className="my-2">
          {achievements.map((achievement, index) => {
            if (achievement.achieved) {
              return (
                <AchievementCard
                  key={index}
                  title={achievement.title}
                  description={achievement.description}
                  achieved={achievement.achieved}
                  current={achievement.current}
                  target={achievement.target}
                  unit={achievement.unit}
                />
              )
            }
          })}
        </View>
      </View>
    )
  }

  return (
    <View className="grow bg-smoke-1 dark:bg-night-1">
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollIndicatorInsets={{
          top: useAppBarHeight(),
          left: 0,
          bottom: useBottomTabBarHeight(),
          right: 0,
        }}
      >
        <View
          className="mx-2 my-2 grow"
          style={{ paddingBottom: useBottomTabBarHeight(), paddingTop: useAppBarHeight() }}
        >
          <View className="items-center">
            <View className="m-2 aspect-square h-36 overflow-hidden rounded-full">
              <Image source={{ uri: userData.profilePic }} className="h-full w-full" />
            </View>
            <Text className="font-custom text-3xl dark:text-white">
              {userData?.name} {userData?.lastName}
            </Text>
          </View>
          <View className="my-2 flex-row justify-center">
            <PressableView>
              <Pressable
                onPress={() => navigation.navigate('EditProfile')}
                className="m-1 rounded-xl bg-smoke-2 p-2 dark:bg-night-2"
              >
                <Text className="font-custom text-xl dark:text-white">Edit Profile</Text>
              </Pressable>
            </PressableView>
            <PressableView>
              <Pressable
                onPress={() => navigation.navigate('Configuration')}
                className="m-1 rounded-xl bg-smoke-2 p-2 dark:bg-night-2"
              >
                <Text className="font-custom text-xl dark:text-white">Configuration</Text>
              </Pressable>
            </PressableView>
          </View>
          <View className="flex-row">
            <View
              className={`flex-1 items-center ${view === 'achievements' && 'border-b-2 border-b-primary-1'}`}
            >
              <PressableView>
                <Pressable
                  onPress={() => {
                    setView('achievements')
                    scrollViewRef.current.scrollTo({ x: 0, y: 250, animated: true })
                  }}
                >
                  <Text className="font-custom text-2xl dark:text-white">Achievements</Text>
                </Pressable>
              </PressableView>
            </View>
            <View
              className={`flex-1 items-center ${view === 'stats' && 'border-b-2 border-b-primary-1'}`}
            >
              <PressableView>
                <Pressable
                  onPress={() => {
                    setView('stats')
                    scrollViewRef.current.scrollTo({ x: 0, y: 250, animated: true })
                  }}
                >
                  <Text className="font-custom text-2xl dark:text-white">Stats</Text>
                </Pressable>
              </PressableView>
            </View>
          </View>
          <View className="my-2">
            {view === 'achievements' ? <Achievements /> : view === 'stats' && <Stats />}
          </View>
        </View>
      </ScrollView>
      <ScrollToTop />
      <AppBar label={'Profile'} />
    </View>
  )
}

export default Profile
