// src/features/Notifications/components/NotificationBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count,
  size = 'medium'
}) => {
  if (count === 0) return null;

  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      case 'medium':
      default:
        return 12;
    }
  };

  return (
    <View style={[
      styles.badge,
      { width: getBadgeSize(), height: getBadgeSize() }
    ]}>
      <Text style={[styles.text, { fontSize: getFontSize() }]}>
        {count > 9 ? '9+' : count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#d9534f', // Red
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificationBadge;