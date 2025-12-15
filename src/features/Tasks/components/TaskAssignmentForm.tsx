// src/features/Tasks/components/TaskAssignmentForm.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface TaskAssignmentFormProps {
  users: User[];
  currentAssignee?: string;
  onAssign: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

const TaskAssignmentForm: React.FC<TaskAssignmentFormProps> = ({ 
  users, 
  currentAssignee, 
  onAssign,
  isLoading = false
}) => {
  const [selectedUser, setSelectedUser] = useState<string>(currentAssignee || '');

  const handleAssign = async () => {
    if (selectedUser && selectedUser !== currentAssignee) {
      await onAssign(selectedUser);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Task</Text>
      
      {users.length === 0 ? (
        <Text style={styles.noUsers}>No available users to assign</Text>
      ) : (
        <View style={styles.userList}>
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userItem,
                selectedUser === user.id && styles.selectedUser
              ]}
              onPress={() => setSelectedUser(user.id)}
            >
              <Text style={[
                styles.userName,
                selectedUser === user.id && styles.selectedUserText
              ]}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.userRole}>{user.role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity
        style={[
          styles.assignButton,
          (!selectedUser || selectedUser === currentAssignee || isLoading) && styles.disabledButton
        ]}
        onPress={handleAssign}
        disabled={!selectedUser || selectedUser === currentAssignee || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.assignButtonText}>Assign</Text>
        )}
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  userList: {
    marginBottom: 16,
  },
  userItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedUser: {
    borderColor: '#0066cc',
    backgroundColor: '#e6f2ff',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedUserText: {
    color: '#0066cc',
  },
  userRole: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  noUsers: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  assignButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskAssignmentForm;