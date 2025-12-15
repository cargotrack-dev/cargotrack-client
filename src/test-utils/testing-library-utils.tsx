// src/test-utils/testing-library-utils.tsx
import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

interface CustomRenderOptions extends RenderOptions {
  route?: string;
  history?: string[];
}

// Custom render function to wrap components with necessary providers
function render(
  ui: React.ReactElement,
  {
    route = '/',
    history = [route],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const Wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
      <MemoryRouter initialEntries={history} initialIndex={0}>
        {children}
      </MemoryRouter>
    );
  };
  
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from testing-library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
// Override the render method
export { render };