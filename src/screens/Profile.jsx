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
import ProfilePictureProgress from '../components/ProfilePictureProgress'

const Profile = ({ navigation }) => {
  const userData = useSelector(selectUserData)
  const userAllTrainingDaysData = useSelector(selectUserAllTrainingDaysData)
  const scrollViewRef = useRef()
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [view, setView] = useState('achievements')

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
          <PressableView
            onPress={() => scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })}
          >
            <View className="m-2">
              <CustomIcon name={'keyboardDoubleArrowUp'} size={40} color={'white'} />
            </View>
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

  const generateXpLevels = (baseXp, initialIncrement, factor, count) => {
    let levels = []
    let increment = initialIncrement

    for (let i = 0; i < count; i++) {
      levels.push(baseXp)
      baseXp += increment
      increment *= factor
    }

    return levels
  }

  const calculateUserLevel = (xp, levels) => {
    let level = 0
    let nextLevelXp = 0

    for (let i = 0; i < levels.length; i++) {
      if (xp < levels[i]) {
        nextLevelXp = levels[i]
        break
      }
      level = i + 1
    }

    return {
      level,
      nextLevelXp,
      currentLevelXp: levels[level - 1] || 0,
      xp,
    }
  }

  const xpLevels = generateXpLevels(100, 100, 1.5, 50)
  const { level, nextLevelXp, currentLevelXp, xp } = calculateUserLevel(userData.userXp, xpLevels)

  const Stats = () => {
    return (
      <View>
        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">Ejercicios</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.userTotalExercisesNumber || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">Series</Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.userTotalSetsNumber || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Repeticiones
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.userTotalRepsNumber || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Peso levantado
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.userTotalWeightNumber || 0)} kg
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Ejer. de Pecho
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberChest || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Ejer. de Biceps
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberBicep || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Ejer. de Triceps
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberTricep || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Ejer. de Hombro
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberShoulder || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Ejer. de Espalda
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberBack || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Ejer. de Pierna
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.exercisesNumberLegs || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Entrenaminetos finalizados
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.trainingsFinished || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Entrenamientos no finalizados
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {formatNumber(userData.userStats.trainingsNotFinished || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Tiempo entrenado
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            {msToTime(userData.userStats.userTotalTrainingTime || 0)}
          </Text>
        </View>

        <View className="m-1 flex-row items-center justify-end">
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
            Tiempo medio
          </Text>
          <View className="grow">
            <Divider height={2} width={'80%'} />
          </View>
          <Text className="font-rubik-regular text-xl opacity-70 dark:text-white">
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
        className={`my-2 flex-row rounded-xl bg-smoke-2 p-2 dark:bg-night-2 ${
          achieved ? 'border border-officeGreen' : 'border border-smoke-3 dark:border-night-3'
        }`}
      >
        <View className="flex-1">
          <Text className="flex-shrink-1 mb-2 font-rubik-regular text-2xl dark:text-white">
            {title}
          </Text>
          <Divider />
          <Text className="flex-shrink-1 my-2 font-rubik-regular text-lg opacity-70 dark:text-white">
            {description}
          </Text>
          {unit === 'time' ? (
            <Text className="text-md my-2 font-rubik-regular opacity-70 dark:text-white">
              ({msToTime(current || 0)} / {msToTime(target || 0)})
            </Text>
          ) : (
            <Text className="text-md my-2 font-rubik-regular opacity-70 dark:text-white">
              ({formatNumber(current || 0)} {unit} / {formatNumber(target || 0)} {unit})
            </Text>
          )}
          <ProgressBar current={current} target={target} height={6} />
        </View>
        <View className="flex-shrink-0 flex-grow-0">
          <CustomIcon name="trophy" size={30} opacity={0.7} color={achieved ? 'green' : 'white'} />
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
          title: 'Fuerza Bruta',
          description: 'Levanta peso, cada repetición cuenta',
          unit: 'kg',
          levels: generateLevels(10000, 5000, 1.1, 50),
        },
      ],
      userTotalRepsNumber: [
        {
          title: 'Rey de las Repeticiones',
          description: 'Haz reps de cualquier ejercicio',
          unit: 'reps',
          levels: generateLevels(1000, 500, 1.1, 50),
        },
      ],
      userTotalTrainingTime: [
        {
          title: 'Tiempo de Entrenamiento',
          description: 'Echa horas en el gimnasio, sin prisa pero sin pausa',
          unit: 'time',
          levels: generateLevels(3600000, 3600000, 1.1, 50),
        },
      ],
      userTotalSetsNumber: [
        {
          title: 'Maestro de Series',
          description: 'Termina tus series, no seas cagallón',
          unit: 'series',
          levels: generateLevels(100, 50, 1.1, 50),
        },
      ],
      userTotalExercisesNumber: [
        {
          title: 'Entusiasta del Ejercicio',
          description: 'Acaba las series de tues ejercicios, no te quedes a medias',
          unit: 'ejer.',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberBicep: [
        {
          title: 'Fan del Bíceps',
          description: 'Termina ejercicios de bíceps',
          unit: 'ejer.',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberTricep: [
        {
          title: 'Especialista en Tríceps',
          description: 'Termina ejercicios de tríceps',
          unit: 'ejer.',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberChest: [
        {
          title: 'Campeón de Pecho',
          description: 'Termina ejercicios de pecho',
          unit: 'ejer.',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberBack: [
        {
          title: 'Bestia de Espalda',
          description: 'Termina ejercicios de espalda',
          unit: 'ejer.',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberShoulder: [
        {
          title: 'Destructor de Hombros',
          description: 'Termina ejercicios de hombros',
          unit: 'ejer.',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      exercisesNumberLegs: [
        {
          title: 'Leyenda de Piernas',
          description: 'Termina ejercicios de piernas',
          unit: 'ejer.',
          levels: generateLevels(15, 5, 1.1, 50),
        },
      ],
      trainingsFinished: [
        {
          title: 'Terminator de Entrenamientos',
          description: 'Termina tus sesiones de entrenamiento, sin excusas',
          unit: 'ses.',
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
          <AchievementCard
            title={'Nivel ' + (level + 1)}
            description={'Consigue Xp'}
            achieved={false}
            current={xp}
            target={nextLevelXp}
            unit={'xp'}
          />
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
        <Text className="font-rubik-regular text-2xl dark:text-white">
          Completados ({completedAchievements})
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
            <ProfilePictureProgress
              profilePic={userData.profilePic}
              currentXp={xp}
              level={level}
              targetXp={nextLevelXp}
              size={150}
            />
            <Text className="font-rubik-regular text-3xl dark:text-white">
              {userData?.name} {userData?.lastName}
            </Text>
          </View>
          <View className="my-2 flex-row justify-center">
            <PressableView onPress={() => navigation.navigate('EditProfile')}>
              <View className="m-1 rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
                <Text className="font-rubik-regular text-xl dark:text-white">Editar perfil</Text>
              </View>
            </PressableView>
            <PressableView onPress={() => navigation.navigate('Configuration')}>
              <View className="m-1 rounded-xl bg-smoke-2 p-2 dark:bg-night-2">
                <Text className="font-rubik-regular text-xl dark:text-white">Configuración</Text>
              </View>
            </PressableView>
          </View>
          <View className="flex-row">
            <View
              className={`flex-1 items-center ${view === 'achievements' && 'border-b-2 border-b-primary-1'}`}
            >
              <PressableView
                onPress={() => {
                  setView('achievements')
                  scrollViewRef.current.scrollTo({ x: 0, y: 250, animated: true })
                }}
              >
                <Text
                  className={`font-rubik-regular text-2xl opacity-70 dark:text-white ${view === 'achievements' && 'opacity-100'}`}
                >
                  Logros
                </Text>
              </PressableView>
            </View>
            <View
              className={`flex-1 items-center ${view === 'stats' && 'border-b-2 border-b-primary-1'}`}
            >
              <PressableView
                onPress={() => {
                  setView('stats')
                  scrollViewRef.current.scrollTo({ x: 0, y: 250, animated: true })
                }}
              >
                <Text
                  className={`font-rubik-regular text-2xl opacity-70 dark:text-white ${view === 'stats' && 'opacity-100'}`}
                >
                  Estadísticas
                </Text>
              </PressableView>
            </View>
          </View>
          <View className="my-2">
            {view === 'achievements' ? <Achievements /> : view === 'stats' && <Stats />}
          </View>
        </View>
      </ScrollView>
      <ScrollToTop />
      <AppBar label={'Perfil'} />
    </View>
  )
}

export default Profile
