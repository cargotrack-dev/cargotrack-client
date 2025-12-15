// src/features/Tasks/pages/TaskDetailPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Task } from '../types/task';
import { getTaskById, updateTaskStatus } from '../services/taskService';
import TaskStatusBadge from '../components/TaskStatusBadge';
import TaskPriorityIndicator from '../components/TaskPriorityIndicator';
import TaskAssignmentForm from '../components/TaskAssignmentForm';

const TaskDetailPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params as { taskId: string };
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Mock users for assignment (in a real app, you'd fetch these)
  const [users] = useState([
    { id: 'user1', firstName: 'John', lastName: 'Doe', role: 'OPERATOR' },
    { id: 'user2', firstName: 'Jane', lastName: 'Smith', role: 'DRIVER' },
  ]);

  // ✅ FIXED: Use useCallback to memoize fetchTaskDetails
  const fetchTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const taskData = await getTaskById(taskId);
      setTask(taskData);
    } catch (err) {
      setError('Failed to load task details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [taskId]); // ✅ FIXED: Include taskId as dependency

  // ✅ FIXED: Now fetchTaskDetails is stable and can be included in dependencies
  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  // ✅ FIXED: Add navigation functionality - back button
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!task) return;
    
    try {
      setUpdatingStatus(true);
      const updatedTask = await updateTaskStatus(task.id, newStatus);
      setTask(updatedTask);
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignTask = async (userId: string) => {
    // This would call your assignTask API
    console.log(`Assign task ${taskId} to user ${userId}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Task not found'}</Text>
        <View style={styles.errorActions}>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTaskDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const canUpdateStatus = task.status !== 'COMPLETED' && task.status !== 'CANCELLED';

  return (
    <ScrollView style={styles.container}>
      {/* ✅ ADDED: Header with back button */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={handleGoBack}>
          <Text style={styles.backButtonHeaderText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.taskType}>{task.type}</Text>
        <TaskPriorityIndicator priority={task.priority} />
      </View>
      
      <Text style={styles.description}>{task.description}</Text>
      
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Status</Text>
        <TaskStatusBadge status={task.status} />
        
        {canUpdateStatus && (
          <View style={styles.statusActions}>
            {task.status !== 'IN_PROGRESS' && (
              <TouchableOpacity
                style={[styles.actionButton, updatingStatus && styles.disabledButton]}
                onPress={() => handleUpdateStatus('IN_PROGRESS')}
                disabled={updatingStatus}
              >
                <Text style={styles.actionButtonText}>Start Task</Text>
              </TouchableOpacity>
            )}
            
            {task.status === 'IN_PROGRESS' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton, updatingStatus && styles.disabledButton]}
                onPress={() => handleUpdateStatus('COMPLETED')}
                disabled={updatingStatus}
              >
                <Text style={styles.actionButtonText}>Complete Task</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      {task.truckId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Truck</Text>
          <Text style={styles.sectionText}>ID: {task.truckId}</Text>
        </View>
      )}
      
      <TaskAssignmentForm
        users={users}
        currentAssignee={task.assignedTo}
        onAssign={handleAssignTask}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  // ✅ ADDED: New header bar styles
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButtonHeader: {
    marginRight: 16,
  },
  backButtonHeaderText: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskType: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statusSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#444',
  },
  statusActions: {
    marginTop: 16,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    marginRight: 12,
  },
  completeButton: {
    backgroundColor: '#5cb85c',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    marginBottom: 16,
    textAlign: 'center',
  },
  // ✅ ADDED: Error actions container
  errorActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // ✅ ADDED: Back button styles
  backButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TaskDetailPage;