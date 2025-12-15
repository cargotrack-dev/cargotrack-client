// src/features/Tasks/pages/TaskListPage.tsx
import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTaskList } from '../hooks/useTaskList';
import TaskCard from '../components/TaskCard';
import TaskFilter from '../components/TaskFilter';

type NavigationProp = {
  navigate: (screen: string, params?: object) => void;
};

const TaskListPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { tasks, loading, filters, updateFilters } = useTaskList(false);

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TaskFilter currentFilters={filters} onFilterChange={updateFilters} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={handleTaskPress} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
});

export default TaskListPage;