// src/features/Tasks/pages/TaskDetailPage.tsx
// ✅ FIXED - Removed React Native, converted to web with React Router

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '../types/task';
import { getTaskById, updateTaskStatus } from '../services/taskService';
import TaskStatusBadge from '../components/TaskStatusBadge';
import TaskPriorityIndicator from '../components/TaskPriorityIndicator';
import TaskAssignmentForm from '../components/TaskAssignmentForm';

const TaskDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Mock users for assignment
  const [users] = useState([
    { id: 'user1', firstName: 'John', lastName: 'Doe', role: 'OPERATOR' },
    { id: 'user2', firstName: 'Jane', lastName: 'Smith', role: 'DRIVER' },
  ]);

  const fetchTaskDetails = useCallback(async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      setError(null);
      
      const taskData = await getTaskById(taskId);
      setTask(taskData);
    } catch (err) {
      setError('Failed to load task details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleGoBack = () => {
    navigate(-1 as any);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!task) return;
    
    try {
      setUpdatingStatus(true);
      const updatedTask = await updateTaskStatus(task.id, newStatus);
      setTask(updatedTask);
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignTask = async (userId: string) => {
    console.log(`Assign task ${taskId} to user ${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4">
        <p className="text-red-600 text-center mb-4">{error || 'Task not found'}</p>
        <div className="flex gap-3">
          <button 
            onClick={fetchTaskDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
          <button 
            onClick={handleGoBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const canUpdateStatus = task.status !== 'COMPLETED' && task.status !== 'CANCELLED';

  return (
    <div className="overflow-auto bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header with back button */}
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Task Header */}
        <div className="bg-white rounded-lg p-6 mb-6 flex justify-between items-start">
          <h1 className="text-3xl font-bold">{task.type}</h1>
          <TaskPriorityIndicator priority={task.priority} />
        </div>

        {/* Description */}
        <p className="bg-white rounded-lg p-6 mb-6 text-gray-700 leading-relaxed">
          {task.description}
        </p>

        {/* Status Section */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Status</h2>
          <div className="mb-4">
            <TaskStatusBadge status={task.status} />
          </div>
          
          {canUpdateStatus && (
            <div className="flex gap-3">
              {task.status !== 'IN_PROGRESS' && (
                <button
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={updatingStatus}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition"
                >
                  Start Task
                </button>
              )}
              
              {task.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => handleUpdateStatus('COMPLETED')}
                  disabled={updatingStatus}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded transition"
                >
                  Complete Task
                </button>
              )}
            </div>
          )}
        </div>

        {/* Truck Info */}
        {task.truckId && (
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Truck</h2>
            <p className="text-gray-700">ID: {task.truckId}</p>
          </div>
        )}

        {/* Task Assignment */}
        <div className="mb-6">
          <TaskAssignmentForm
            users={users}
            currentAssignee={task.assignedTo}
            onAssign={handleAssignTask}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;