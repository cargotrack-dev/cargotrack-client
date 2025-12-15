// src/features/Notifications/types/notification.ts
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt?: string;
  relatedId?: string;
  createdAt: string;
}