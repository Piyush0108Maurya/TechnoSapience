import { render } from '@testing-library/react';
import App from './App';

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

test('renders without crashing', () => {
  expect(() => render(<App />)).not.toThrow();
});
