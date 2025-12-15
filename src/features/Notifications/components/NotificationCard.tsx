// src/features/Notifications/components/NotificationCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Notification } from '../types/notification';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

// ✅ FIXED: Define valid icon names with proper typing
type FeatherIconName = 'clipboard' | 'package' | 'plus-circle' | 'bell';

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
  // ✅ FIXED: Helper function with proper return type
  const getIconName = (type: string): FeatherIconName => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return 'clipboard';
      case 'SHIPMENT_STATUS_UPDATE':
        return 'package';
      case 'NEW_SHIPMENT':
        return 'plus-circle';
      default:
        return 'bell';
    }
  };

  // Format timestamp to a readable format
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <TouchableOpacity 
      style={[styles.container, !notification.read && styles.unread]} 
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconContainer}>
        <Feather 
          name={getIconName(notification.type)} 
          size={24} 
          color="#0066cc" 
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  unread: {
    backgroundColor: '#f0f7ff',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0066cc',
    alignSelf: 'center',
    marginLeft: 8,
  },
});

export default NotificationCard;