// src/features/Tasks/components/TaskPriorityIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TaskPriorityIndicatorProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const TaskPriorityIndicator: React.FC<TaskPriorityIndicatorProps> = ({ priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'HIGH':
        return '#d9534f'; // Red
      case 'MEDIUM':
        return '#f0ad4e'; // Orange
      case 'LOW':
        return '#5cb85c'; // Green
      default:
        return '#777777'; // Gray
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: getPriorityColor() }]} />
      <Text style={styles.text}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    color: '#666',
  },
});

export default TaskPriorityIndicator;