import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/task';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityIndicator from './TaskPriorityIndicator';

interface Props {
  task: Task;
  onPress: (taskId: string) => void;
}

const TaskCard: React.FC<Props> = ({ task, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(task.id)}
    >
      <View style={styles.header}>
        <Text style={styles.type}>{task.type}</Text>
        <TaskPriorityIndicator priority={task.priority} />
      </View>
      <Text style={styles.description}>{task.description}</Text>
      <View style={styles.footer}>
        <TaskStatusBadge status={task.status} />
        {task.assignedTo && (
          <Text style={styles.assignee}>Assigned to: {task.assignedTo}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignee: {
    fontSize: 12,
    color: '#777',
  },
});

export default TaskCard;