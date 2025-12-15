// src/features/Tasks/components/TaskStatusBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TaskStatusBadgeProps {
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'PENDING':
        return '#f8d775'; // Yellow
      case 'ASSIGNED':
        return '#5bc0de'; // Blue
      case 'IN_PROGRESS':
        return '#f0ad4e'; // Orange
      case 'COMPLETED':
        return '#5cb85c'; // Green
      case 'CANCELLED':
        return '#d9534f'; // Red
      default:
        return '#777777'; // Gray
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.text}>{status.replace('_', ' ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default TaskStatusBadge;