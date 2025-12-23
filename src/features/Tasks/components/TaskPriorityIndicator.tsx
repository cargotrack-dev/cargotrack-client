// src/features/Tasks/components/TaskPriorityIndicator.tsx
// ✅ FIXED - Removed React Native, converted to web

import React from 'react';

interface TaskPriorityIndicatorProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const TaskPriorityIndicator: React.FC<TaskPriorityIndicatorProps> = ({ priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500'; // Red
      case 'MEDIUM':
        return 'bg-yellow-500'; // Orange
      case 'LOW':
        return 'bg-green-500'; // Green
      default:
        return 'bg-gray-500'; // Gray
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getPriorityColor()}`}></div>
      <span className="text-sm text-gray-600">{priority}</span>
    </div>
  );
};

export default TaskPriorityIndicator;