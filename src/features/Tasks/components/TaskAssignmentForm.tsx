// src/features/Tasks/components/TaskAssignmentForm.tsx
// ✅ FIXED - Removed React Native, converted to web

import React, { useState } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface TaskAssignmentFormProps {
  users: User[];
  currentAssignee?: string;
  onAssign: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

const TaskAssignmentForm: React.FC<TaskAssignmentFormProps> = ({ 
  users, 
  currentAssignee, 
  onAssign,
  isLoading = false
}) => {
  const [selectedUser, setSelectedUser] = useState<string>(currentAssignee || '');

  const handleAssign = async () => {
    if (selectedUser && selectedUser !== currentAssignee) {
      await onAssign(selectedUser);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4">Assign Task</h3>
      
      {users.length === 0 ? (
        <p className="text-gray-500 italic mb-4">No available users to assign</p>
      ) : (
        <div className="mb-4 space-y-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`
                w-full p-3 rounded border-2 transition-colors text-left
                ${selectedUser === user.id 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
                }
              `}
            >
              <p className={`font-medium ${selectedUser === user.id ? 'text-blue-600' : 'text-gray-900'}`}>
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600 mt-1">{user.role}</p>
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={handleAssign}
        disabled={!selectedUser || selectedUser === currentAssignee || isLoading}
        className={`
          w-full py-3 px-4 rounded font-bold text-white transition-colors
          ${!selectedUser || selectedUser === currentAssignee || isLoading
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            Assigning...
          </span>
        ) : (
          'Assign'
        )}
      </button>
    </div>
  );
};

export default TaskAssignmentForm;