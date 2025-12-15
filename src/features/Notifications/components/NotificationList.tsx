// src/features/Notifications/components/NotificationList.tsx
import React from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Notification } from '../types/notification';
import NotificationCard from './NotificationCard';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onNotificationPress: (notification: Notification) => void;
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onNotificationPress,
  onEndReached,
  refreshing = false,
  onRefresh
}) => {
  if (loading && notifications.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No notifications</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => (
        <NotificationCard
          notification={item}
          onPress={onNotificationPress}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListFooterComponent={
        loading && notifications.length > 0 ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color="#0066cc" />
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default NotificationList;