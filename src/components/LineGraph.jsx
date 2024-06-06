import React, { useState } from 'react'
import { View, Pressable, Text as RNText, useColorScheme } from 'react-native'
import * as d3 from 'd3'
import Svg, { Path, G, Text as SvgText, Line, Circle } from 'react-native-svg'
import moment from 'moment'
import PressableView from './PressableView'
import CustomIcon from './CustomIcon'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

export default function LineGraph({
  data = [],
  width = 350,
  height = 100,
  lineWidth = 2,
  yLines = 4,
  lineColor = '#FF2400',
  dotColor = '#FF5000',
  opacity = '0.3',
  onNextMonth,
  onPrevMonth,
}) {
  const margin = { top: 5, right: 5, bottom: 25, left: 50 }
  const colorScheme = useColorScheme()
  const color = colorScheme === 'light' ? 'black' : 'white'

  const [month, setMonth] = useState(new Date().getMonth())

  const startDate = moment().month(month).startOf('month').toDate()
  const endDate = moment().month(month).endOf('month').toDate()

  const filteredData = data.filter((d) => {
    const date = new Date(d.date)
    return date >= startDate && date <= endDate
  })

  const xScale = d3
    .scaleTime()
    .domain([startDate, endDate])
    .range([margin.left, width - margin.right])

  const xValues = d3.timeWeeks(startDate, endDate).map((date) => new Date(date))
  const dailyXValues = d3.timeDays(startDate, endDate).map((date) => new Date(date)) // Para las líneas diarias

  const yMax =
    Math.max(
      Math.ceil(d3.max(data, (d) => d.value) || 0),
      Math.ceil(filteredData.reduce((acc, curr) => Math.max(acc, curr.value), 0)),
    ) || 10

  const yMin = data.length
    ? Math.min(
        Math.floor(d3.min(data, (d) => d.value) || 0),
        Math.floor(filteredData.reduce((acc, curr) => Math.min(acc, curr.value), Infinity)),
      )
    : 0

  const yValues = Array.from(
    { length: yLines },
    (_, i) => yMin + (yMax - yMin) * (i / (yLines - 1)),
  ).reverse()

  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin.bottom, margin.top])

  const line = d3
    .line()
    .x((d) => xScale(new Date(d.date)))
    .y((d) => yScale(d.value))
    .curve(d3.curveMonotoneX)

  const handleNextMonth = () => {
    setMonth(month + 1)
    if (onNextMonth) {
      onNextMonth(month + 1)
    }
  }
  const handlePrevMonth = () => {
    setMonth(month - 1)
    if (onPrevMonth) {
      onPrevMonth(month - 1)
    }
  }

  const swipeMonthGesture = Gesture.Pan()
    .minDistance(50)
    .onEnd((event) => {
      if (event.translationX < 0) {
        runOnJS(handleNextMonth)()
      } else if (event.translationX > 0) {
        runOnJS(handlePrevMonth)()
      }
    })

  return (
    <GestureDetector gesture={swipeMonthGesture}>
      <View>
        <View className="flex-row items-center justify-center">
          <PressableView onPress={handlePrevMonth}>
            <CustomIcon name={'chevronBack'} size={40} opacity={0.7} />
          </PressableView>

          <RNText className="mx-10 font-rubik-regular text-xl opacity-70 dark:text-white">
            {moment().month(month).format('MMM YYYY')}
          </RNText>

          <PressableView onPress={handleNextMonth}>
            <CustomIcon name={'chevronForward'} size={40} opacity={0.7} />
          </PressableView>
        </View>
        <Svg width={width} height={height} className="mx-auto">
          <G>
            {yValues.map((value, index) => (
              <G key={index}>
                <Line
                  x1={margin.left}
                  y1={yScale(value)}
                  x2={width - margin.right}
                  y2={yScale(value)}
                  stroke={color}
                  strokeWidth="1"
                  opacity={opacity}
                />
                <SvgText
                  x={margin.left - 25}
                  y={yScale(value) + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill={color}
                  fontFamily="Rubik"
                  opacity={opacity}
                >
                  {value.toFixed()}
                </SvgText>
                <SvgText
                  x={margin.left - 5}
                  y={yScale(value) + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill={color}
                  fontFamily="Rubik"
                  opacity={opacity}
                >
                  Kg
                </SvgText>
              </G>
            ))}
            {xValues.map((date, index) => {
              const xPos = xScale(date)
              const yPos = height - margin.bottom + 15
              return (
                <G key={index}>
                  <SvgText
                    x={xPos}
                    y={yPos + 5}
                    textAnchor="middle"
                    fontSize="12"
                    fill={color}
                    fontFamily="Rubik"
                    opacity={opacity}
                  >
                    {moment(date).format('MM/DD')}
                  </SvgText>
                </G>
              )
            })}
            {dailyXValues.map((date, index) => (
              <Line
                key={index}
                x1={xScale(date)}
                y1={yScale(yMin)}
                x2={xScale(date)}
                y2={yScale(yMin) + 5}
                stroke={color}
                strokeWidth="1"
                opacity={opacity}
              />
            ))}
            {filteredData.length > 0 && (
              <G>
                <Path
                  d={line(filteredData)}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  opacity="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {filteredData.map((d, index) => (
                  <Circle
                    key={index}
                    cx={xScale(new Date(d.date))}
                    cy={yScale(d.value)}
                    r={lineWidth + 1}
                    fill={dotColor}
                    opacity="1"
                  />
                ))}
              </G>
            )}
          </G>
        </Svg>
      </View>
    </GestureDetector>
  )
}
