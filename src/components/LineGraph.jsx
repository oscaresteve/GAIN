import React, { useState } from 'react'
import { View, Pressable, Text as RNText, useColorScheme } from 'react-native'
import * as d3 from 'd3'
import Svg, { Path, G, Text as Text, Line } from 'react-native-svg'
import moment from 'moment'
import PressableView from './PressableView'
import CustomIcon from './CustomIcon'

export default function LineGraph({ data, width, height, lineColor = '#FF2400' }) {
  const margin = { top: 5, right: 5, bottom: 25, left: 50 }
  const colorScheme = useColorScheme()
  const color = colorScheme === 'light' ? 'black' : 'white'

  const [month, setMonth] = useState(new Date().getMonth())
  const handleChangeMonth = (newMonth) => {
    setMonth(newMonth)
  }

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

  const yMax = Math.max(
    Math.ceil(d3.max(data, (d) => d.value)),
    Math.ceil(filteredData.reduce((acc, curr) => Math.max(acc, curr.value), 0)),
  )

  const yValues = Array.from({ length: 5 }, (_, i) => yMax * (i / 4)).reverse()

  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([height - margin.bottom, margin.top])

  const line = d3
    .line()
    .x((d) => xScale(new Date(d.date)))
    .y((d) => yScale(d.value))
    .curve(d3.curveBasis)

  return (
    <View>
      <View className="flex-row items-center justify-center">
        <PressableView>
          <Pressable onPress={() => handleChangeMonth(month - 1)}>
            <CustomIcon name={'keyboard-arrow-left'} size={40} color={'black'} />
          </Pressable>
        </PressableView>

        <RNText className="mx-10 font-custom text-xl dark:text-white">
          {moment().month(month).format('MMM YYYY')}
        </RNText>

        <PressableView>
          <Pressable onPress={() => handleChangeMonth(month + 1)}>
            <CustomIcon name={'keyboard-arrow-right'} size={40} color={'black'} />
          </Pressable>
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
                opacity="0.5"
              />
              <Text
                x={margin.left - 25}
                y={yScale(value) + 5}
                textAnchor="end"
                fontSize="12"
                fill={color}
                fontFamily="Rubik"
                opacity="0.5"
              >
                {value.toFixed()}
              </Text>
              <Text
                x={margin.left - 5}
                y={yScale(value) + 5}
                textAnchor="end"
                fontSize="12"
                fill={color}
                fontFamily="Rubik"
                opacity="0.5"
              >
                Kg
              </Text>
            </G>
          ))}
          {xValues.map((date, index) => {
            const xPos = xScale(date)
            const yPos = height - margin.bottom + 15
            return (
              <G key={index}>
                <Text
                  x={xPos}
                  y={yPos + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill={color}
                  fontFamily="Rubik"
                  opacity="0.5"
                >
                  {moment(date).format('MM/DD')}
                </Text>
              </G>
            )
          })}
          {filteredData.length > 0 && (
            <Path
              d={line(filteredData)}
              fill="none"
              stroke={lineColor}
              strokeWidth={4}
              opacity="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </G>
      </Svg>
    </View>
  )
}
