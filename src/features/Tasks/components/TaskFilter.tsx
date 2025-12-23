// src/features/Tasks/components/TaskFilter.tsx
// ✅ FIXED - Removed React Native, converted to web

import React from 'react';

interface TaskFilterProps {
  currentFilters: {
    status?: string;
    priority?: string;
    type?: string;
  };
  onFilterChange: (filters: any) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilters, onFilterChange }) => {
  const statusOptions = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const priorityOptions = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];
  const typeOptions = ['ALL', 'MAINTENANCE', 'INSPECTION', 'CLEANING', 'DELIVERY', 'PICKUP', 'OTHER'];

  const handleStatusFilter = (status: string) => {
    onFilterChange({ 
      ...currentFilters, 
      status: status === 'ALL' ? undefined : status 
    });
  };

  const handlePriorityFilter = (priority: string) => {
    onFilterChange({ 
      ...currentFilters, 
      priority: priority === 'ALL' ? undefined : priority 
    });
  };

  const handleTypeFilter = (type: string) => {
    onFilterChange({ 
      ...currentFilters, 
      type: type === 'ALL' ? undefined : type 
    });
  };

  const isStatusActive = (status: string) => 
    (status === 'ALL' && !currentFilters.status) || status === currentFilters.status;
  
  const isPriorityActive = (priority: string) => 
    (priority === 'ALL' && !currentFilters.priority) || priority === currentFilters.priority;
  
  const isTypeActive = (type: string) => 
    (type === 'ALL' && !currentFilters.type) || type === currentFilters.type;

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
      <h2 className="text-lg font-bold mb-4">Filters</h2>
      
      {/* Status Filter */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-2">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                isStatusActive(status)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-2">Priority</h3>
        <div className="flex flex-wrap gap-2">
          {priorityOptions.map(priority => (
            <button
              key={priority}
              onClick={() => handlePriorityFilter(priority)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                isPriorityActive(priority)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="text-base font-semibold mb-2">Type</h3>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map(type => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                isTypeActive(type)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;