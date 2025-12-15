// src/features/UI/components/ui/__tests__/card.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import { Card, CardHeader, CardTitle, CardContent } from '../card';

describe('Card Components', () => {
  test('renders Card component with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('renders CardHeader component with children', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  test('renders CardTitle component with children', () => {
    render(<CardTitle>Title Content</CardTitle>);
    expect(screen.getByText('Title Content')).toBeInTheDocument();
  });

  test('renders CardContent component with children', () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('applies custom className to Card', () => {
    render(<Card className="custom-class">Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('bg-white');
  });
});