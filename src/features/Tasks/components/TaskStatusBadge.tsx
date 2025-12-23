// src/features/Tasks/components/TaskStatusBadge.tsx
// ✅ FIXED - Removed React Native, converted to web

import React from 'react';

interface TaskStatusBadgeProps {
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-300 text-gray-900'; // Yellow
      case 'ASSIGNED':
        return 'bg-blue-300 text-gray-900'; // Light Blue
      case 'IN_PROGRESS':
        return 'bg-orange-400 text-white'; // Orange
      case 'COMPLETED':
        return 'bg-green-500 text-white'; // Green
      case 'CANCELLED':
        return 'bg-red-500 text-white'; // Red
      default:
        return 'bg-gray-400 text-white'; // Gray
    }
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor()}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default TaskStatusBadge;