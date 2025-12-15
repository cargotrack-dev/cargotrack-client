// src/features/Tasks/index.ts

// Re-export components
export { default as TaskCard } from './components/TaskCard';
export { default as TaskStatusBadge } from './components/TaskStatusBadge';
export { default as TaskPriorityIndicator } from './components/TaskPriorityIndicator';
export { default as TaskAssignmentForm } from './components/TaskAssignmentForm';
export { default as TaskFilter } from './components/TaskFilter';

// Re-export pages
export { default as TaskListPage } from './pages/TaskListPage';
export { default as TaskDetailPage } from './pages/TaskDetailPage';

// Re-export hooks
export { useTaskList } from './hooks/useTaskList';
export { useTaskActions } from './hooks/useTaskActions.ts';

// Re-export types
export type { Task, TaskFilters } from './types/task';

// Re-export services
export {
  getMyTasks,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  assignTask
} from './services/taskService';