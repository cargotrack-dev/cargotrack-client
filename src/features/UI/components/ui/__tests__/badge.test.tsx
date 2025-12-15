// src/features/UI/components/ui/__tests__/badge.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import { Badge } from '../badge';

describe('Badge Component', () => {
  test('renders Badge component with children', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('applies the default styling', () => {
    render(<Badge>Status</Badge>);
    const badge = screen.getByText('Status');
    // Check for expected default classes - update these based on your implementation
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('rounded-full');
  });

  test('applies custom className', () => {
    render(<Badge className="custom-badge">Status</Badge>);
    const badge = screen.getByText('Status');
    expect(badge).toHaveClass('custom-badge');
  });

  test('applies variant styles', () => {
    render(<Badge variant="outline">Status</Badge>);
    const badge = screen.getByText('Status');
    expect(badge).toHaveClass('border');
    // Add more assertions based on your variant styling
  });
});