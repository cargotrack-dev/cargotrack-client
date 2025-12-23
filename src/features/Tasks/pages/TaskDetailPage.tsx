// src/features/Tasks/pages/TaskDetailPage.tsx
// WEB VERSION - Fixed for React web (NOT React Native)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  type: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  truckId?: string;
}

const TaskDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Mock users
  const [users] = useState([
    { id: 'user1', firstName: 'John', lastName: 'Doe', role: 'OPERATOR' },
    { id: 'user2', firstName: 'Jane', lastName: 'Smith', role: 'DRIVER' },
  ]);

  // Mock task data
  const mockTasks: Record<string, Task> = {
    '1': {
      id: '1',
      type: 'Delivery',
      description: 'Deliver cargo to Lagos warehouse',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedTo: 'user1',
      truckId: 'TRK-001',
    },
    '2': {
      id: '2',
      type: 'Inspection',
      description: 'Vehicle inspection and maintenance',
      status: 'PENDING',
      priority: 'MEDIUM',
      truckId: 'TRK-002',
    },
  };

  const fetchTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      const taskData = mockTasks[taskId || '1'];
      if (taskData) {
        setTask(taskData);
      } else {
        setError('Task not found');
      }
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
    navigate('/tasks');
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!task) return;
    
    try {
      setUpdatingStatus(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setTask({ ...task, status: newStatus as Task['status'] });
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignTask = async (userId: string) => {
    console.log(`Assign task ${taskId} to user ${userId}`);
    if (task) {
      setTask({ ...task, assignedTo: userId });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ fontSize: '16px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '20px'
      }}>
        <AlertCircle size={48} color="#d9534f" style={{ marginBottom: '16px' }} />
        <p style={{ fontSize: '16px', color: '#d9534f', marginBottom: '16px' }}>
          {error || 'Task not found'}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchTaskDetails}
            style={{
              padding: '10px 16px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Retry
          </button>
          <button
            onClick={handleGoBack}
            style={{
              padding: '10px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const canUpdateStatus = task.status !== 'COMPLETED' && task.status !== 'CANCELLED';
  const statusColors: Record<Task['status'], string> = {
    'PENDING': '#ffc107',
    'IN_PROGRESS': '#0066cc',
    'COMPLETED': '#5cb85c',
    'CANCELLED': '#d9534f',
  };

  const priorityColors: Record<Task['priority'], string> = {
    'LOW': '#6c757d',
    'MEDIUM': '#ffc107',
    'HIGH': '#ff9800',
    'URGENT': '#d9534f',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={handleGoBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 0',
            background: 'none',
            border: 'none',
            color: '#0066cc',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <ArrowLeft size={20} />
          Back to Tasks
        </button>
      </div>

      {/* Task Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
            {task.type}
          </h1>
          <p style={{ margin: 0, color: '#666' }}>{task.description}</p>
        </div>
        <div style={{
          padding: '6px 12px',
          backgroundColor: priorityColors[task.priority],
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {task.priority}
        </div>
      </div>

      {/* Status Section */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Status</h3>
        
        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: statusColors[task.status],
          color: 'white',
          borderRadius: '4px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          {task.status.replace('_', ' ')}
        </div>

        {canUpdateStatus && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {task.status !== 'IN_PROGRESS' && (
              <button
                onClick={() => handleUpdateStatus('IN_PROGRESS')}
                disabled={updatingStatus}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: updatingStatus ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: updatingStatus ? 0.6 : 1,
                }}
              >
                Start Task
              </button>
            )}

            {task.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleUpdateStatus('COMPLETED')}
                disabled={updatingStatus}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#5cb85c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: updatingStatus ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: updatingStatus ? 0.6 : 1,
                }}
              >
                <CheckCircle size={16} />
                Complete Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Truck Info */}
      {task.truckId && (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Truck</h3>
          <p style={{ margin: 0, color: '#666' }}>ID: <strong>{task.truckId}</strong></p>
        </div>
      )}

      {/* Assignment */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>Assign To</h3>
        <select
          value={task.assignedTo || ''}
          onChange={(e) => handleAssignTask(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        >
          <option value="">Select a user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} ({user.role})
            </option>
          ))}
        </select>
        {task.assignedTo && (
          <p style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
            Assigned to: <strong>{users.find(u => u.id === task.assignedTo)?.firstName}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;