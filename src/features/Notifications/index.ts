// src/features/Notifications/index.ts

// Re-export components
export { default as NotificationCard } from './components/NotificationCard';
export { default as NotificationList } from './components/NotificationList';
export { default as NotificationBadge } from './components/NotificationBadge';

// Re-export pages
export { default as NotificationsPage } from './pages/NotificationsPage';

// Re-export hooks
export { useNotifications } from './hooks/useNotifications';
export { useNotificationActions } from './hooks/useNotificationActions';

// Re-export types
export type { Notification } from './types/notification';

// Re-export services
export {
  getNotifications,
  markAsRead,
  markAllAsRead
} from './services/notificationService';