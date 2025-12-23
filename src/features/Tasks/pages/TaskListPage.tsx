// src/features/Tasks/pages/TaskListPage.tsx
// WEB VERSION - Fixed for React web (NOT React Native)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';

interface Task {
  id: string;
  type: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  truckId?: string;
}

interface TaskFilter {
  status?: string;
  priority?: string;
  search?: string;
}

const TaskListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilter>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Mock task data
  const mockTasks: Task[] = [
    {
      id: '1',
      type: 'Delivery',
      description: 'Deliver cargo to Lagos warehouse',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedTo: 'user1',
      truckId: 'TRK-001',
    },
    {
      id: '2',
      type: 'Inspection',
      description: 'Vehicle inspection and maintenance',
      status: 'PENDING',
      priority: 'MEDIUM',
      truckId: 'TRK-002',
    },
    {
      id: '3',
      type: 'Loading',
      description: 'Load cargo at Abuja depot',
      status: 'COMPLETED',
      priority: 'LOW',
      assignedTo: 'user2',
      truckId: 'TRK-003',
    },
    {
      id: '4',
      type: 'Route Check',
      description: 'Check optimal route to Port Harcourt',
      status: 'PENDING',
      priority: 'URGENT',
      truckId: 'TRK-001',
    },
  ];

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setTasks(mockTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (searchTerm && !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  const handleFilterChange = (newFilters: TaskFilter) => {
    setFilters(newFilters);
  };

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

  if (loading && tasks.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ fontSize: '16px', color: '#666' }}>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
          Tasks
        </h1>
        <button
          onClick={handleCreateTask}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <Search size={18} color="#666" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
            flex: 1,
            minWidth: '200px',
          }}
        />

        <Filter size={18} color="#666" />
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange({ ...filters, status: e.target.value || undefined })}
          style={{
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange({ ...filters, priority: e.target.value || undefined })}
          style={{
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          color: '#666',
        }}>
          <p style={{ fontSize: '16px', margin: 0 }}>No tasks found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task.id)}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                    {task.type}
                  </h3>
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: priorityColors[task.priority],
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    {task.priority}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                  {task.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#999' }}>
                  {task.truckId && <span>🚛 {task.truckId}</span>}
                  {task.assignedTo && <span>👤 Assigned</span>}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '12px',
              }}>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: statusColors[task.status],
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginTop: '24px',
      }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            {filteredTasks.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Total Tasks</div>
        </div>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            {filteredTasks.filter(t => t.status === 'PENDING').length}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Pending</div>
        </div>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            {filteredTasks.filter(t => t.status === 'IN_PROGRESS').length}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>In Progress</div>
        </div>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
            {filteredTasks.filter(t => t.status === 'COMPLETED').length}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Completed</div>
        </div>
      </div>
    </div>
  );
};

export default TaskListPage;