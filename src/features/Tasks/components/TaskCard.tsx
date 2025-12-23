// src/features/Tasks/components/TaskCard.tsx
// ✅ FIXED - Removed React Native, converted to web

import React from 'react';
import { Task } from '../types/task';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityIndicator from './TaskPriorityIndicator';

interface Props {
  task: Task;
  onPress: (taskId: string) => void;
}

const TaskCard: React.FC<Props> = ({ task, onPress }) => {
  return (
    <button
      onClick={() => onPress(task.id)}
      className="w-full bg-white rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition cursor-pointer text-left border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-base font-bold">{task.type}</h3>
        <TaskPriorityIndicator priority={task.priority} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <TaskStatusBadge status={task.status} />
        {task.assignedTo && (
          <span className="text-xs text-gray-700">Assigned to: {task.assignedTo}</span>
        )}
      </div>
    </button>
  );
};

export default TaskCard;