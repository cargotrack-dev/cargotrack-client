// src/features/Notifications/pages/NotificationsPage.tsx
import React from 'react';
import { View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types/notification';
import NotificationList from '../components/NotificationList';

type NavigationProp = {
  navigate: (screen: string, params?: object) => void;
};

const NotificationsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markNotificationRead,
    markAllNotificationsRead,
    refreshNotifications
  } = useNotifications();

  const handleNotificationPress = (notification: Notification) => {
    // Mark notification as read
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.relatedId) {
      switch (notification.type) {
        case 'TASK_ASSIGNED':
          navigation.navigate('TaskDetail', { taskId: notification.relatedId });
          break;
        case 'SHIPMENT_STATUS_UPDATE':
          navigation.navigate('ShipmentDetail', { shipmentId: notification.relatedId });
          break;
        // Add other navigation cases as needed
      }
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.actionBar}>
          <Button
            title={`Mark All as Read (${unreadCount})`}
            onPress={markAllNotificationsRead}
          />
        </View>
      )}
      
      <NotificationList 
        notifications={notifications}
        loading={loading}
        onNotificationPress={handleNotificationPress}
        refreshing={false}
        onRefresh={refreshNotifications}
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
  actionBar: {
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default NotificationsPage;