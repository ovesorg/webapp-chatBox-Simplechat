# API Documentation

## Overview

This document describes the API interfaces, WebSocket protocol, and data structures used in the Omnivoltaic Assist
ChatBot application.

**Production WebSocket URL**: `wss://oves-bot.omnivoltaic.com/chat`

## Table of Contents

- [WebSocket API](#websocket-api)
- [Authentication API](#authentication-api)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## WebSocket API

### Connection

**Production Endpoint:** `wss://oves-bot.omnivoltaic.com/chat`

**Development Endpoint:** `ws://localhost:8080`

**Protocol:** WebSocket (WSS for production)

### Connection Lifecycle

#### 1. Establishing Connection

```javascript
// Production
const ws = new WebSocket('wss://oves-bot.omnivoltaic.com/chat');

// Development
// const ws = new WebSocket('ws://localhost:8080');

ws.onopen = (event) => {
  console.log('WebSocket connection established');
  // Connection ready for communication
};
```

#### 2. Connection Events

| Event     | Description            | Handler        |
|-----------|------------------------|----------------|
| `open`    | Connection established | `ws.onopen`    |
| `message` | Message received       | `ws.onmessage` |
| `error`   | Error occurred         | `ws.onerror`   |
| `close`   | Connection closed      | `ws.onclose`   |

#### 3. Closing Connection

```javascript
ws.close(1000, 'Normal closure');
```

### Message Types

#### User Message

**Direction:** Client → Server

**Purpose:** Send user's chat message to the bot

**Format:**

```json
{
  "type": "user_message",
  "text": "What is the weather today?",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-10-07T20:47:13Z",
  "session_id": "optional-session-id"
}
```

**Fields:**

- `type` (string, required): Message type identifier
- `text` (string, required): User's message content
- `user_id` (string, required): UUID v4 identifier
- `timestamp` (string, required): ISO-8601 formatted timestamp
- `session_id` (string, optional): Session identifier

**Example:**

```javascript
const message = {
  type: 'user_message',
  text: input,
  user_id: localStorage.getItem('user_id'),
  timestamp: new Date().toISOString()
};
ws.send(JSON.stringify(message));
```

#### Bot Response

**Direction:** Server → Client

**Purpose:** Receive bot's response to user message

**Format:**

```json
{
  "type": "bot_response",
  "text": "The weather today is sunny with a high of 75°F.",
  "timestamp": "2025-10-07T20:47:15Z",
  "message_id": "msg-12345",
  "confidence": 0.95
}
```

**Fields:**

- `type` (string): Response type identifier
- `text` (string): Bot's response content
- `timestamp` (string): ISO-8601 formatted timestamp
- `message_id` (string): Unique message identifier
- `confidence` (number, optional): Confidence score (0-1)

**Example Handler:**

```javascript
ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  if (response.type === 'bot_response') {
    setMessages(prev => [...prev, {
      position: 'left',
      type: 'text',
      text: response.text,
      date: new Date(response.timestamp)
    }]);
  }
};
```

#### Feedback Submission

**Direction:** Client → Server

**Purpose:** Submit user feedback and rating for bot response

**Format:**

```json
{
  "type": "feedback",
  "user_query": "What is the weather today?",
  "bot_response": "The weather today is sunny with a high of 75°F.",
  "user_expected_response": "I wanted to know about tomorrow's weather",
  "user_rating": 3,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-10-07T20:47:20Z"
}
```

**Fields:**

- `type` (string, required): Message type ("feedback")
- `user_query` (string, required): Original user question
- `bot_response` (string, required): Bot's answer
- `user_expected_response` (string, optional): User's feedback text
- `user_rating` (integer, required): Rating from 1-5
- `user_id` (string, required): UUID v4 identifier
- `timestamp` (string, required): ISO-8601 formatted timestamp

**Example:**

```javascript
const feedbackData = {
  type: 'feedback',
  user_query: messages[messages.length - 2].text,
  bot_response: messages[messages.length - 1].text,
  user_expected_response: feedback,
  user_rating: value,
  user_id: localStorage.getItem('user_id'),
  timestamp: new Date().toISOString()
};
ws.send(JSON.stringify(feedbackData));
```

#### System Messages

**Direction:** Server → Client

**Purpose:** System notifications and status updates

**Format:**

```json
{
  "type": "system",
  "message": "Connection established",
  "level": "info",
  "timestamp": "2025-10-07T20:47:13Z"
}
```

**Levels:**

- `info`: Informational message
- `warning`: Warning message
- `error`: Error message
- `success`: Success confirmation

### Error Messages

**Direction:** Server → Client

**Format:**

```json
{
  "type": "error",
  "code": "INVALID_MESSAGE",
  "message": "Message format is invalid",
  "details": "Missing required field: user_id",
  "timestamp": "2025-10-07T20:47:13Z"
}
```

**Error Codes:**

- `INVALID_MESSAGE`: Message format error
- `AUTHENTICATION_FAILED`: Auth error
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error
- `CONNECTION_TIMEOUT`: Connection timeout

## Authentication API

### Azure AD (MSAL)

#### Configuration

Located in `src/pages/authConfig.js`

```javascript
export const msalConfig = {
  auth: {
    clientId: "your-client-id",
    authority: "https://login.microsoftonline.com/your-tenant-id",
    redirectUri: "http://localhost:3000"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};
```

#### Login Flow

```javascript
import { useMsal } from '@azure/msal-react';

const { instance } = useMsal();

// Initiate login
const handleLogin = async () => {
  try {
    const response = await instance.loginPopup({
      scopes: ["user.read"]
    });
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Acquire Token

```javascript
const acquireToken = async () => {
  const request = {
    scopes: ["user.read"],
    account: instance.getActiveAccount()
  };
  
  try {
    const response = await instance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    // Fallback to interactive
    const response = await instance.acquireTokenPopup(request);
    return response.accessToken;
  }
};
```

#### Logout

```javascript
const handleLogout = () => {
  instance.logoutPopup();
};
```

### Google OAuth

#### Configuration

```javascript
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Wrap app with provider
<GoogleOAuthProvider clientId="your-google-client-id">
  <App />
</GoogleOAuthProvider>
```

#### Login Flow

```javascript
const login = useGoogleLogin({
  onSuccess: (response) => {
    console.log('Login successful:', response);
    // Use access token
  },
  onError: (error) => {
    console.error('Login failed:', error);
  }
});
```

## Data Models

### Message Object

```typescript
interface Message {
  position: 'left' | 'right';
  type: 'text' | 'photo' | 'file';
  text: string;
  date: Date;
  title?: string;
  avatar?: string;
  status?: 'waiting' | 'sent' | 'received' | 'read';
}
```

### User Object

```typescript
interface User {
  id: string;           // UUID v4
  name?: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
}
```

### Feedback Object

```typescript
interface Feedback {
  id: string;
  userId: string;
  userQuery: string;
  botResponse: string;
  userExpectedResponse?: string;
  rating: number;       // 1-5
  timestamp: Date;
}
```

### Session Object

```typescript
interface Session {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  active: boolean;
}
```

## Error Handling

### Client-Side Error Handling

```javascript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  // Show user-friendly error message
  showNotification('Connection error. Please try again.', 'error');
};

ws.onclose = (event) => {
  if (event.code !== 1000) {
    // Abnormal closure
    console.error('Connection closed unexpectedly:', event.code, event.reason);
    // Attempt reconnection
    setTimeout(() => reconnect(), 5000);
  }
};
```

### Error Response Format

```json
{
  "type": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": "Additional error details",
  "timestamp": "2025-10-07T20:47:13Z",
  "requestId": "req-12345"
}
```

### HTTP Status Codes (if applicable)

| Code | Meaning               | Description                     |
|------|-----------------------|---------------------------------|
| 200  | OK                    | Request successful              |
| 400  | Bad Request           | Invalid request format          |
| 401  | Unauthorized          | Authentication required         |
| 403  | Forbidden             | Insufficient permissions        |
| 429  | Too Many Requests     | Rate limit exceeded             |
| 500  | Internal Server Error | Server error                    |
| 503  | Service Unavailable   | Service temporarily unavailable |

## Rate Limiting

### WebSocket Rate Limits

- **Messages per minute**: 60
- **Feedback submissions per hour**: 100
- **Connection attempts per minute**: 5

### Rate Limit Response

```json
{
  "type": "error",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please slow down.",
  "retryAfter": 60,
  "timestamp": "2025-10-07T20:47:13Z"
}
```

### Handling Rate Limits

```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.code === 'RATE_LIMIT_EXCEEDED') {
    const retryAfter = data.retryAfter || 60;
    showNotification(`Rate limit exceeded. Please wait ${retryAfter} seconds.`, 'warning');
    
    // Disable input temporarily
    setInputDisabled(true);
    setTimeout(() => setInputDisabled(false), retryAfter * 1000);
  }
};
```

## Best Practices

### 1. Connection Management

```javascript
// Implement reconnection logic
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const connect = () => {
  const ws = new WebSocket('wss://backend-url/ws');
  
  ws.onclose = (event) => {
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      setTimeout(() => connect(), delay);
    }
  };
  
  ws.onopen = () => {
    reconnectAttempts = 0;
  };
};
```

### 2. Message Queuing

```javascript
// Queue messages when disconnected
const messageQueue = [];

const sendMessage = (message) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    messageQueue.push(message);
  }
};

ws.onopen = () => {
  // Send queued messages
  while (messageQueue.length > 0) {
    ws.send(JSON.stringify(messageQueue.shift()));
  }
};
```

### 3. Input Validation

```javascript
const validateMessage = (text) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }
  if (text.length > 1000) {
    throw new Error('Message too long (max 1000 characters)');
  }
  return text.trim();
};
```

### 4. Secure Token Handling

```javascript
// Never send tokens via WebSocket
// Use separate HTTP headers for authentication
const connectWithAuth = async () => {
  const token = await acquireToken();
  const ws = new WebSocket('wss://backend-url/ws', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

## Testing

### WebSocket Testing

```javascript
// Mock WebSocket for testing
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.();
    }, 100);
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
    }, 200);
  }
  
  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose?.();
  }
}
```

### Example Test

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ChatBot from './chatbot';

test('sends message via WebSocket', async () => {
  global.WebSocket = MockWebSocket;
  
  render(<ChatBot />);
  
  const input = screen.getByPlaceholderText('Type a message...');
  const button = screen.getByText('Send');
  
  fireEvent.change(input, { target: { value: 'Hello' } });
  fireEvent.click(button);
  
  // Assert message sent and response received
  await screen.findByText('Mock response');
});
```

## Changelog

### Version 1.0.0 (Current)

- Initial WebSocket API implementation
- Azure AD and Google OAuth integration
- Feedback system
- Basic error handling

### Future Enhancements

- Message history API
- File upload support
- Typing indicators
- Read receipts
- Multi-language support
