/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest to handle TypeScript files
  preset: 'ts-jest',
  
  // Use jsdom environment for browser-like environment in Node.js
  testEnvironment: 'jest-environment-jsdom',
  
  // File extensions Jest should look for
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transform files with ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      isolatedModules: true
    }]
  },
  
  // Files to run before tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Map module paths
  moduleNameMapper: {
    // Map feature imports
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    
    // Handle CSS imports (if you're using CSS)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',

    'lucide-react$': '<rootDir>/src/__mocks__/lucide-react.tsx'
  },
  
  // Configure transformIgnorePatterns to handle ES modules in node_modules
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react|react-router|react-router-dom).+\\.js$'
  ],
  
  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Collect coverage from these directories
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/vite-env.d.ts'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Display individual test results
  verbose: true,
  
  // Global test timeout (ms)
  testTimeout: 15000,
};