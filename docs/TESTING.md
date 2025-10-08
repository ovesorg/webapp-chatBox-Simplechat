# Testing Guide

This document provides comprehensive testing guidelines and best practices for the OVES ChatBot application.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)
- [Continuous Integration](#continuous-integration)

## Testing Philosophy

We follow the testing pyramid approach:

```
        /\
       /  \      E2E Tests (Few)
      /____\
     /      \    Integration Tests (Some)
    /________\
   /          \  Unit Tests (Many)
  /____________\
```

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test how components work together
- **E2E Tests**: Test complete user workflows

## Testing Stack

### Core Testing Libraries

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers

### Optional Testing Tools

- **Cypress**: E2E testing (recommended for future implementation)
- **MSW (Mock Service Worker)**: API mocking
- **jest-websocket-mock**: WebSocket mocking

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ChatBot.test.js

# Run tests matching pattern
npm test -- --testNamePattern="sends message"

# Update snapshots
npm test -- -u
```

### Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage --watchAll=false

# View coverage in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds

Configure in `package.json`:

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Unit Testing

### Component Testing

#### Basic Component Test

```javascript
import { render, screen } from '@testing-library/react';
import ChatBot from './chatbot';

describe('ChatBot Component', () => {
  test('renders chat interface', () => {
    render(<ChatBot />);
    
    // Check if elements are present
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});
```

#### Testing User Interactions

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('sends message on button click', async () => {
  const user = userEvent.setup();
  render(<ChatBot />);
  
  const input = screen.getByPlaceholderText(/type a message/i);
  const button = screen.getByRole('button', { name: /send/i });
  
  // Type message
  await user.type(input, 'Hello, bot!');
  
  // Click send button
  await user.click(button);
  
  // Verify message appears
  expect(screen.getByText('Hello, bot!')).toBeInTheDocument();
});
```

#### Testing State Changes

```javascript
test('updates input value on change', async () => {
  const user = userEvent.setup();
  render(<ChatBot />);
  
  const input = screen.getByPlaceholderText(/type a message/i);
  
  await user.type(input, 'Test message');
  
  expect(input).toHaveValue('Test message');
});
```

#### Testing Props

```javascript
import Emoji from './components/Emoji';

test('renders emoji with correct symbol', () => {
  render(<Emoji symbol="😊" label="happy" />);
  
  expect(screen.getByLabelText('happy')).toHaveTextContent('😊');
});
```

### Mocking Dependencies

#### Mocking WebSocket

```javascript
// __mocks__/websocket.js
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.();
    }, 0);
  }
  
  send(data) {
    // Simulate server response
    setTimeout(() => {
      this.onmessage?.({
        data: JSON.stringify({
          type: 'bot_response',
          text: 'Mock response'
        })
      });
    }, 100);
  }
  
  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose?.();
  }
}

global.WebSocket = MockWebSocket;
```

#### Mocking MSAL

```javascript
jest.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      loginPopup: jest.fn().mockResolvedValue({
        account: { username: 'test@example.com' }
      }),
      logoutPopup: jest.fn(),
      acquireTokenSilent: jest.fn().mockResolvedValue({
        accessToken: 'mock-token'
      })
    },
    accounts: [{ username: 'test@example.com' }]
  }),
  MsalProvider: ({ children }) => children
}));
```

#### Mocking LocalStorage

```javascript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock;

// In test
beforeEach(() => {
  localStorage.getItem.mockReturnValue('mock-user-id');
});

afterEach(() => {
  jest.clearAllMocks();
});
```

### Testing Hooks

```javascript
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

function useCounter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}

test('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Integration Testing

### Testing Component Integration

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('complete chat flow', async () => {
  const user = userEvent.setup();
  
  // Mock WebSocket
  global.WebSocket = MockWebSocket;
  
  render(<App instance={mockMsalInstance} />);
  
  // Wait for component to load
  await waitFor(() => {
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });
  
  // Send message
  const input = screen.getByPlaceholderText(/type a message/i);
  await user.type(input, 'Test message');
  await user.click(screen.getByRole('button', { name: /send/i }));
  
  // Wait for response
  await waitFor(() => {
    expect(screen.getByText('Mock response')).toBeInTheDocument();
  });
});
```

### Testing Authentication Flow

```javascript
test('authentication flow', async () => {
  const user = userEvent.setup();
  const mockLogin = jest.fn().mockResolvedValue({
    account: { username: 'test@example.com' }
  });
  
  const mockInstance = {
    loginPopup: mockLogin,
    getActiveAccount: jest.fn().mockReturnValue(null)
  };
  
  render(<App instance={mockInstance} />);
  
  // Click login button
  const loginButton = screen.getByRole('button', { name: /login/i });
  await user.click(loginButton);
  
  // Verify login was called
  expect(mockLogin).toHaveBeenCalled();
  
  // Wait for authenticated state
  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
```

### Testing Feedback System

```javascript
test('submits feedback', async () => {
  const user = userEvent.setup();
  const mockSend = jest.fn();
  
  global.WebSocket = class extends MockWebSocket {
    send = mockSend;
  };
  
  render(<ChatBot />);
  
  // Send message and receive response
  // ... (message flow)
  
  // Open feedback
  const feedbackButton = screen.getByRole('button', { name: /feedback/i });
  await user.click(feedbackButton);
  
  // Set rating
  const stars = screen.getAllByRole('radio');
  await user.click(stars[3]); // 4 stars
  
  // Enter feedback text
  const feedbackInput = screen.getByPlaceholderText(/your feedback/i);
  await user.type(feedbackInput, 'Great response!');
  
  // Submit
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);
  
  // Verify WebSocket send was called with correct data
  expect(mockSend).toHaveBeenCalledWith(
    expect.stringContaining('"user_rating":4')
  );
});
```

## End-to-End Testing

### Cypress Setup (Recommended)

Install Cypress:

```bash
npm install --save-dev cypress
```

Add script to `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}
```

### Example E2E Test

```javascript
// cypress/e2e/chat.cy.js
describe('Chat Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });
  
  it('sends and receives messages', () => {
    // Login (if required)
    cy.get('[data-testid="login-button"]').click();
    
    // Type message
    cy.get('[data-testid="message-input"]')
      .type('Hello, bot!');
    
    // Send message
    cy.get('[data-testid="send-button"]').click();
    
    // Verify message appears
    cy.contains('Hello, bot!').should('be.visible');
    
    // Wait for bot response
    cy.contains('bot response', { timeout: 10000 })
      .should('be.visible');
  });
  
  it('submits feedback', () => {
    // ... send message flow
    
    // Click feedback
    cy.get('[data-testid="feedback-button"]').click();
    
    // Select rating
    cy.get('[data-testid="rating-4"]').click();
    
    // Enter feedback
    cy.get('[data-testid="feedback-input"]')
      .type('Helpful response');
    
    // Submit
    cy.get('[data-testid="submit-feedback"]').click();
    
    // Verify success message
    cy.contains('Thank you for your feedback')
      .should('be.visible');
  });
});
```

## Test Coverage

### Viewing Coverage

```bash
npm test -- --coverage --watchAll=false
```

Coverage report shows:

- **Statements**: % of statements executed
- **Branches**: % of conditional branches executed
- **Functions**: % of functions called
- **Lines**: % of lines executed

### Coverage Goals

- **Critical paths**: 100% coverage
- **Components**: 80%+ coverage
- **Utilities**: 90%+ coverage
- **Overall**: 80%+ coverage

### Uncovered Code

Identify uncovered code:

```bash
# Generate coverage
npm test -- --coverage --watchAll=false

# View detailed report
open coverage/lcov-report/index.html
```

## Best Practices

### 1. Test Behavior, Not Implementation

```javascript
// ✅ Good: Test user-visible behavior
test('displays error message on invalid input', async () => {
  const user = userEvent.setup();
  render(<ChatBot />);
  
  await user.click(screen.getByRole('button', { name: /send/i }));
  
  expect(screen.getByText(/message cannot be empty/i)).toBeInTheDocument();
});

// ❌ Bad: Test implementation details
test('sets error state to true', () => {
  const { result } = renderHook(() => useChatBot());
  
  act(() => {
    result.current.sendEmptyMessage();
  });
  
  expect(result.current.error).toBe(true);
});
```

### 2. Use Accessible Queries

Priority order:

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

```javascript
// ✅ Good: Use semantic queries
screen.getByRole('button', { name: /send/i });
screen.getByLabelText(/message/i);

// ❌ Bad: Use test IDs unnecessarily
screen.getByTestId('send-button');
```

### 3. Avoid Testing Library Implementation

```javascript
// ✅ Good: Test React component
test('renders message', () => {
  render(<MessageBox text="Hello" />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

// ❌ Bad: Test library internals
test('MessageBox uses react-chat-elements', () => {
  // Don't test third-party library implementation
});
```

### 4. Clean Up After Tests

```javascript
beforeEach(() => {
  // Setup
  localStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup
  cleanup();
});
```

### 5. Use Descriptive Test Names

```javascript
// ✅ Good: Descriptive names
test('displays error when message exceeds 1000 characters', () => {});
test('clears input field after sending message', () => {});

// ❌ Bad: Vague names
test('it works', () => {});
test('test 1', () => {});
```

### 6. Test Edge Cases

```javascript
describe('Message Input', () => {
  test('handles empty input', () => {});
  test('handles very long input', () => {});
  test('handles special characters', () => {});
  test('handles emoji', () => {});
  test('handles whitespace-only input', () => {});
});
```

### 7. Mock External Dependencies

```javascript
// Mock API calls
jest.mock('axios');

// Mock WebSocket
global.WebSocket = MockWebSocket;

// Mock authentication
jest.mock('@azure/msal-react');
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
```

### Pre-commit Hooks

Install Husky:

```bash
npm install --save-dev husky
npx husky install
```

Add pre-commit hook:

```bash
npx husky add .husky/pre-commit "npm test -- --watchAll=false"
```

## Debugging Tests

### Running Tests in Debug Mode

```bash
# Node debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# VS Code: Add to launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### Using debug() Utility

```javascript
import { render, screen, debug } from '@testing-library/react';

test('debugging example', () => {
  render(<ChatBot />);
  
  // Print entire DOM
  screen.debug();
  
  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

## Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Remember**: Good tests give you confidence to refactor and add features without breaking existing functionality!
