# CargoTrack Pro: Permission System Usage Guide

This guide explains how to use the role-based access control (RBAC) system integrated into CargoTrack Pro.

## Overview

The permission system in CargoTrack Pro provides fine-grained access control based on:

- **User Roles**: Predefined sets of permissions (e.g., Admin, Manager, Dispatcher)
- **Resource Types**: Entities in the system (Shipments, Cargo, Vehicles, etc.)
- **Actions**: Operations that can be performed (Create, Read, Update, Delete, etc.)
- **Constraints**: Optional additional restrictions (e.g., only own resources)

## How to Use the Permission System

### 1. Protecting Routes

Use the `ProtectedRoute` component in `App.tsx` to restrict access to specific routes:

```tsx
<Route path="cargo" element={
  <ProtectedRoute 
    element={<CargoList />} 
    requiredPermission={{ resource: ResourceType.CARGO, action: PermissionAction.READ }} 
  />
} />
```

### 2. Conditional Rendering with PermissionGate

Use the `PermissionGate` component to conditionally render UI elements based on permissions:

```tsx
// Show a button only if the user has permission to create cargo
<PermissionGate
  permissions={{ resource: ResourceType.CARGO, action: PermissionAction.CREATE }}
>
  <Button onClick={handleCreateCargo}>Create New Cargo</Button>
</PermissionGate>
```

You can also check for multiple permissions or provide a fallback:

```tsx
<PermissionGate
  permissions={[
    { resource: ResourceType.CARGO, action: PermissionAction.UPDATE },
    { resource: ResourceType.CARGO, action: PermissionAction.DELETE }
  ]}
  requireAll={false} // User needs any of these permissions (default)
  fallback={<p>You don't have permission to edit this cargo.</p>}
>
  <EditCargoForm cargo={cargo} />
</PermissionGate>
```

### 3. Role-Based Access Control

You can also restrict access based on roles:

```tsx
<PermissionGate
  roles={[UserRole.ADMIN, UserRole.MANAGER]}
>
  <AdminSettingsPanel />
</PermissionGate>
```

### 4. Using the useAuth Hook in Components

For more direct permission checks in your components, use the `useAuth` hook:

```tsx
import { useAuth } from '../contexts/AuthContext';
import { ResourceType, PermissionAction } from '../types/auth';

function MyComponent() {
  const { hasPermission, hasRole, user } = useAuth();
  
  // Check if user has permission to create invoices
  const canCreateInvoice = hasPermission(ResourceType.INVOICE, PermissionAction.CREATE);
  
  // Check if user has a specific role
  const isAdmin = hasRole('ADMIN');
  
  return (
    <div>
      {canCreateInvoice && (
        <button onClick={handleCreateInvoice}>Create Invoice</button>
      )}
      
      {isAdmin && (
        <AdminPanel />
      )}
    </div>
  );
}
```

### 5. Context-Based Permission Checking

For more advanced cases, you can use context-based permission checking:

```tsx
const { canAccess } = useAuth();

// Check if user can update this particular cargo item
const canEditThisCargo = canAccess(
  ResourceType.CARGO, 
  PermissionAction.UPDATE, 
  {
    ownerId: cargo.createdBy,      // Only if user created it
    clientId: cargo.clientId,      // Only for specific client
    valueLimit: 10000              // Only if value is under limit
  }
);
```

## Permission Types

The system defines the following resource types and actions:

### Resource Types

```typescript
export enum ResourceType {
  SHIPMENT = 'SHIPMENT',
  CARGO = 'CARGO',
  VEHICLE = 'VEHICLE',
  DRIVER = 'DRIVER',
  INVOICE = 'INVOICE',
  CLIENT = 'CLIENT',
  REPORT = 'REPORT',
  USER = 'USER',
  ROLE = 'ROLE',
  SETTING = 'SETTING',
  TEMPLATE = 'TEMPLATE',
  MAINTENANCE = 'MAINTENANCE',
  ROUTE = 'ROUTE',
  COST = 'COST',
  REVENUE = 'REVENUE',
  DOCUMENT = 'DOCUMENT',
  DASHBOARD = 'DASHBOARD',
  NOTIFICATION = 'NOTIFICATION'
}
```

### Permission Actions

```typescript
export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  ASSIGN = 'ASSIGN',
  EXECUTE = 'EXECUTE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  SHARE = 'SHARE',
  PRINT = 'PRINT',
  MANAGE = 'MANAGE'    // Full resource management
}
```

## User Roles

The system defines the following predefined roles:

```typescript
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',   // Complete system access
  ADMIN = 'ADMIN',               // Administrative access without system configuration
  MANAGER = 'MANAGER',           // Management-level access
  DISPATCHER = 'DISPATCHER',     // Responsible for dispatching and route planning
  DRIVER = 'DRIVER',             // Driver-specific access
  ACCOUNTANT = 'ACCOUNTANT',     // Financial access
  CLIENT = 'CLIENT',             // External client access
  MAINTENANCE = 'MAINTENANCE',   // Maintenance team
  ANALYST = 'ANALYST',           // Read-only access for analytics
  CUSTOM = 'CUSTOM'              // Custom role with specific permissions
}
```

## Best Practices

1. **Layer your permissions**: Use route protection for coarse-grained access control and component-level checks for fine-grained control.

2. **Be specific with permissions**: Grant the minimum necessary permissions for each role.

3. **Use role-based checks for UI organization**: Hide entire sections of the UI based on roles.

4. **Use permission-based checks for specific actions**: Control individual buttons and features based on specific permissions.

5. **Handle permission denied gracefully**: Always provide feedback when a user cannot access something.

6. **Consider using the requires-all flag**: For sensitive operations, require multiple permissions.

7. **Remember to check permissions on the backend**: Client-side permission checks are for UI purposes only - always validate permissions on the server as well.

## Example Workflow

1. Define the permissions needed for each part of your application
2. Protect routes using `ProtectedRoute` in App.tsx
3. Use `PermissionGate` for conditional UI rendering
4. Use `useAuth` for more dynamic permission checks
5. Add context-based checks for advanced cases

## Adding New Permissions

If you need to add new permissions to the system:

1. Update the `ResourceType` and/or `PermissionAction` enums in `src/types/auth.ts`
2. Update the role permission mappings in the `AuthContext.tsx` file
3. Update the mock user permissions if needed for testing

## Permission Constraints

The system supports several constraint types to further refine permissions:

```typescript
constraints?: {
  ownedOnly?: boolean;            // User can only act on resources they created
  departmentOnly?: boolean;       // User can only act on resources in their department
  clientRestrictions?: string[];  // Restricted to specific clients
  valueLimit?: number;            // Value limit (for financial permissions)
  timeRestriction?: {             // Time-based restriction
    daysInPast?: number;
    daysInFuture?: number;
  };
  customRestriction?: Record<string, unknown>; // Custom restriction logic
}
```

You can use these constraints with the `canAccess` method to implement very specific permission rules.

## Testing Permissions

When testing permissions, you can use the demo accounts provided:

- Super Admin: admin@cargotrackpro.com (password: password)
- Operations Manager: manager@cargotrackpro.com (password: password)
- Dispatcher: dispatcher@cargotrackpro.com (password: password)
- Driver: driver@cargotrackpro.com (password: password)
- Client: client@example.com (password: password)

Each account has different permissions to test various scenarios.

## Debugging Permissions

If you're having trouble with permissions:

1. Check the user's role and permissions in the AuthContext
2. Use the `hasPermission` and `hasRole` methods to debug in components
3. Look for console warnings from the PermissionGate component
4. Verify that the correct permissions are being checked for each action

For example:

```tsx
console.log('User has permission to create cargo:', 
  hasPermission(ResourceType.CARGO, PermissionAction.CREATE));
console.log('User has role ADMIN:', hasRole(UserRole.ADMIN));
```

## Example: Full Implementation

Here's a complete example of how the permission system can be used in a component:

```tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ResourceType, PermissionAction } from '../../types/auth';
import PermissionGate from '../auth/PermissionGate';
import CargoService from '../../services/CargoService';

const CargoManagement = () => {
  const [cargoItems, setCargoItems] = useState([]);
  const { hasPermission, canAccess, user } = useAuth();
  
  useEffect(() => {
    // Fetch cargo items
    const fetchCargo = async () => {
      const items = await CargoService.getAllCargo();
      setCargoItems(items);
    };
    
    fetchCargo();
  }, []);
  
  const handleDeleteCargo = (cargoId) => {
    // Implementation...
  };
  
  return (
    <div>
      <h1>Cargo Management</h1>
      
      <PermissionGate
        permissions={{ resource: ResourceType.CARGO, action: PermissionAction.CREATE }}
      >
        <button>Add New Cargo</button>
      </PermissionGate>
      
      <table>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cargoItems.map(cargo => (
            <tr key={cargo.id}>
              <td>{cargo.reference}</td>
              <td>{cargo.description}</td>
              <td>{cargo.status}</td>
              <td>
                <PermissionGate
                  permissions={{ resource: ResourceType.CARGO, action: PermissionAction.READ }}
                >
                  <button>View</button>
                </PermissionGate>
                
                <PermissionGate
                  permissions={{ resource: ResourceType.CARGO, action: PermissionAction.UPDATE }}
                >
                  <button>Edit</button>
                </PermissionGate>
                
                {/* Context-based permission for delete - only owners or admins */}
                {(canAccess(ResourceType.CARGO, PermissionAction.DELETE, { ownerId: cargo.createdBy }) ||
                  hasRole('ADMIN')) && (
                  <button onClick={() => handleDeleteCargo(cargo.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CargoManagement;
```

This example demonstrates how to use different permission checking approaches based on the context and requirements of each action.

## Conclusion

The permission system in CargoTrack Pro provides a flexible and powerful way to control access to different parts of your application. By combining role-based and permission-based approaches, you can implement a security model that precisely matches your business requirements while keeping your code clean and maintainable.