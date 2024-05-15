import React from 'react'
import { View } from 'react-native'
import * as d3 from 'd3'
import Svg, { Path, G, Text, Line } from 'react-native-svg'
import moment from 'moment'

export default LineGraph = ({ data }) => {
  const width = 350
  const height = 175
  const padding = 30

  const xScale = d3
    .scaleTime()
    .domain([new Date(data[0].date), new Date(data[data.length - 1].date)])
    .range([padding, width - padding])

  const yMin = Math.floor(d3.min(data, (d) => d.value))
  const yMax = Math.ceil(d3.max(data, (d) => d.value))
  const yInterval = (yMax - yMin) / 6
  const yValues = Array.from({ length: 7 }, (_, i) => yMin + i * yInterval)

  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - padding, padding])

  const line = d3
    .line()
    .x((d) => xScale(new Date(d.date)))
    .y((d) => yScale(d.value))
    .curve(d3.curveCardinal.tension(0.3))

  return (
    <Svg width={width} height={height}>
      <G>
        {yValues.map((value, index) => (
          <G key={index}>
            <Line
              x1={padding - 8}
              y1={yScale(value)}
              x2={width - padding}
              y2={yScale(value)}
              stroke={'rgba(0, 0, 0, 0.5)'}
              strokeWidth="1"
            />
            <Text
              x={padding - 10}
              y={yScale(value) + 5}
              textAnchor="end"
              fontSize="12"
              fill="rgba(0, 0, 0, 0.5)"
            >
              {value.toFixed()}
            </Text>
          </G>
        ))}
        {data.map((d, index) => {
          const date = new Date(d.date)
          const xPos = xScale(date)
          const yPos = height - padding + 20
          return (
            <Text
              key={index}
              x={xPos}
              y={yPos}
              textAnchor="middle"
              fontSize="12"
              fill="rgba(0, 0, 0, 0.5)"
            >
              {moment(date).format('DD/MM')}
            </Text>
          )
        })}
        {data.map((d, index) => {
          const date = new Date(d.date)
          const xPos = xScale(date)
          const yPosStart = yScale(yMin)
          const yPosEnd = height - padding + 8
          return (
            <Line
              key={index}
              x1={xPos}
              y1={yPosStart}
              x2={xPos}
              y2={yPosEnd}
              stroke={'rgba(0, 0, 0, 0.5)'}
              strokeWidth="1"
            />
          )
        })}
        <Path d={line(data)} fill="none" stroke="black" strokeWidth={3} />
      </G>
    </Svg>
  )
}
