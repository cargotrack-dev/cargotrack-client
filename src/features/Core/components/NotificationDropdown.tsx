// 📁 src/features/Core/components/NotificationDropdown.tsx
import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'shipment' | 'invoice' | 'system' | 'alert';
  href?: string;
  action?: () => void;
}

export interface NotificationDropdownProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
}

/**
 * NotificationDropdown
 * 
 * Rich notification dropdown with:
 * - Unread count badge
 * - Dropdown with notification list
 * - Read/unread indicators
 * - Timestamps
 * - Mark as read functionality
 * - Clear all option
 */
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
  onClearAll,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    const icons: Record<Notification['type'], string> = {
      shipment: '📦',
      invoice: '💰',
      system: '⚙️',
      alert: '🚨',
    };
    return icons[type];
  };

  // Get notification color
  const getNotificationColor = (type: Notification['type']) => {
    const colors = {
      shipment: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
      invoice: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500',
      system: 'bg-gray-50 dark:bg-gray-900/20 border-l-4 border-gray-500',
      alert: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500',
    };
    return colors[type];
  };

  // Handle notification click
  const handleClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    if (!notification.read) {
      onMarkAsRead?.(notification.id);
    }
    if (notification.href) {
      window.location.href = notification.href;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Notification bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notification dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} unread
                </p>
              )}
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Notifications list */}
          <div className="overflow-y-auto flex-1">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleClick(notification)}
                    className={`
                      w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50
                      transition-colors flex items-start gap-3
                      ${getNotificationColor(notification.type)}
                    `}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 text-xl mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium truncate ${
                            !notification.read
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5 ml-2" />
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg p-3 flex items-center justify-between">
              <a
                href="/notifications"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                View all notifications
              </a>
              {unreadCount > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;