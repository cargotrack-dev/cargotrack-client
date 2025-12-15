// src/features/Tasks/components/TaskFilter.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TaskFilterProps {
  currentFilters: {
    status?: string;
    priority?: string;
    type?: string;
  };
  onFilterChange: (filters: any) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilters, onFilterChange }) => {
  const statusOptions = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const priorityOptions = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];
  const typeOptions = ['ALL', 'MAINTENANCE', 'INSPECTION', 'CLEANING', 'DELIVERY', 'PICKUP', 'OTHER'];

  const handleStatusFilter = (status: string) => {
    onFilterChange({ 
      ...currentFilters, 
      status: status === 'ALL' ? undefined : status 
    });
  };

  const handlePriorityFilter = (priority: string) => {
    onFilterChange({ 
      ...currentFilters, 
      priority: priority === 'ALL' ? undefined : priority 
    });
  };

  const handleTypeFilter = (type: string) => {
    onFilterChange({ 
      ...currentFilters, 
      type: type === 'ALL' ? undefined : type 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
      
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.optionsRow}>
          {statusOptions.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterOption,
                (status === 'ALL' && !currentFilters.status) || status === currentFilters.status 
                  ? styles.activeOption
                  : null
              ]}
              onPress={() => handleStatusFilter(status)}
            >
              <Text 
                style={[
                  styles.optionText,
                  (status === 'ALL' && !currentFilters.status) || status === currentFilters.status 
                    ? styles.activeOptionText
                    : null
                ]}
              >
                {status.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Priority</Text>
        <View style={styles.optionsRow}>
          {priorityOptions.map(priority => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.filterOption,
                (priority === 'ALL' && !currentFilters.priority) || priority === currentFilters.priority 
                  ? styles.activeOption
                  : null
              ]}
              onPress={() => handlePriorityFilter(priority)}
            >
              <Text 
                style={[
                  styles.optionText,
                  (priority === 'ALL' && !currentFilters.priority) || priority === currentFilters.priority 
                    ? styles.activeOptionText
                    : null
                ]}
              >
                {priority}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Type</Text>
        <View style={styles.optionsRow}>
          {typeOptions.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterOption,
                (type === 'ALL' && !currentFilters.type) || type === currentFilters.type 
                  ? styles.activeOption
                  : null
              ]}
              onPress={() => handleTypeFilter(type)}
            >
              <Text 
                style={[
                  styles.optionText,
                  (type === 'ALL' && !currentFilters.type) || type === currentFilters.type 
                    ? styles.activeOptionText
                    : null
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activeOption: {
    backgroundColor: '#0066cc',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  activeOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default TaskFilter;