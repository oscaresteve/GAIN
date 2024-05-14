import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import moment from 'moment'

export default Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment())

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'))
  }

  const handleDayPress = (day) => {
    const newDate = moment(day, 'D')
    setCurrentDate(newDate)
  }

  const renderCalendar = () => {
    const currentMonth = currentDate.month() + 1
    const currentYear = currentDate.year()
    const daysCount = moment(`${currentYear}-${currentMonth}`, 'YYYY-MM').daysInMonth()
    const startingDay = moment(`${currentYear}-${currentMonth}-01`, 'YYYY-MM-DD').day()
    let daysArray = []

    // Agregar días en blanco al principio del mes
    for (let i = 0; i < startingDay; i++) {
      daysArray.push(
        <View key={`blank-start-${i}`} style={styles.dayButton}>
          <Text></Text>
        </View>
      )
    }

    // Agregar días del mes
    for (let i = 1; i <= daysCount; i++) {
      daysArray.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleDayPress(i)}
          style={[styles.dayButton, i === currentDate.date() && styles.selectedDayButton]}
        >
          <Text style={[styles.dayText, i === currentDate.date() && styles.selectedDayText]}>
            {i}
          </Text>
        </TouchableOpacity>
      )
    }

    // Calcular cuántos días en blanco agregar al final para completar 6 filas
    const totalDays = startingDay + daysCount
    const remainingDays = 42 - totalDays

    // Agregar días en blanco al final del mes
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push(
        <View key={`blank-end-${i}`} style={styles.dayButton}>
          <Text></Text>
        </View>
      )
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={styles.navigationText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {currentDate.format('MMMM')} {currentDate.format('YYYY')}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.navigationText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekDaysContainer}>
          {moment.weekdaysShort().map((day, index) => (
            <Text key={index} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.daysContainer}>{daysArray}</View>
      </View>
    )
  }

  return <View>{renderCalendar()}</View>
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navigationText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '14.28%', // Equal width for each day (7 days in a week)
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: '14.28%', // Equal width for each day (7 days in a week)
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedDayButton: {
    backgroundColor: '#007bff',
  },
  dayText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedDayText: {
    color: '#ffffff',
  },
})
