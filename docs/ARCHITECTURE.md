# Architecture Documentation

## System Overview

The Omnivoltaic Assist ChatBot is a modern web application built on a client-server architecture with real-time
communication capabilities. The system consists of a React-based frontend, WebSocket communication layer (
`wss://oves-bot.omnivoltaic.com/chat`), and authentication services.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │ WebSocket    │  │ Auth Module  │      │
│  │   Components │  │ Client       │  │ (MSAL/OAuth) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Services                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ WebSocket    │  │ Chat Engine  │  │ Auth Service │      │
│  │ Server       │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (MsalProvider)
└── ChatBot
    ├── AuthentificationPage
    │   ├── Azure AD Login
    │   └── Google OAuth Login
    ├── Chat Interface
    │   ├── MessageBox (react-chat-elements)
    │   ├── Input Field
    │   └── Send Button
    └── Feedback System
        ├── Rating Component (Material-UI)
        └── Feedback Input
```

### Core Components

#### 1. **App.js**

- Entry point component
- Wraps application with `MsalProvider` for Azure AD authentication
- Passes MSAL instance to child components

#### 2. **ChatBot.js**

- Main chatbot logic and state management
- Manages WebSocket connection
- Handles message flow and user interactions
- Implements feedback collection system

**Key State Variables:**

- `messages`: Array of chat messages
- `ws`: WebSocket connection instance
- `isSignedIn`: Authentication status
- `value`: User rating (1-5 stars)
- `feedback`: User feedback text
- `loading`: Loading state for async operations

#### 3. **Authentication.jsx**

- Handles user authentication flow
- Supports Azure AD and Google OAuth
- Manages authentication state and tokens

#### 4. **Emoji.jsx**

- Reusable emoji component
- Enhances user experience in chat interface

### State Management

The application uses React's built-in state management:

- **useState**: Local component state
- **useEffect**: Side effects and lifecycle management
- **useRef**: DOM references and persistent values

### Data Flow

```
User Input → ChatBot Component → WebSocket Client
                                        ↓
                                  Backend Server
                                        ↓
Bot Response ← ChatBot Component ← WebSocket Client
                    ↓
              Update UI (MessageBox)
```

## Authentication Architecture

### Azure Active Directory (MSAL)

```javascript
// Configuration in authConfig.js
{
  clientId: "Azure AD App Client ID",
  authority: "https://login.microsoftonline.com/{tenant}",
  redirectUri: "Application redirect URI"
}
```

**Flow:**

1. User clicks login
2. Redirected to Azure AD login page
3. User authenticates
4. Token received and stored
5. Token used for API authorization

### Google OAuth

**Flow:**

1. User clicks Google login
2. OAuth popup/redirect
4. Access token received
5. User profile retrieved

## WebSocket Communication

### Connection Management

```javascript
// WebSocket initialization
const ws = new WebSocket('wss://oves-bot.omnivoltaic.com/chat');

ws.onopen = () => {
  // Connection established
};

ws.onmessage = (event) => {
  // Handle incoming messages
};

ws.onerror = (error) => {
  // Handle errors
};

ws.onclose = () => {
  // Handle disconnection
};
```

### Message Protocol

**User Message:**

```json
{
  "type": "user_message",
  "text": "User's question",
  "user_id": "uuid-v4",
  "timestamp": "ISO-8601"
}
```

**Bot Response:**

```json
{
  "type": "bot_response",
  "text": "Bot's answer",
  "timestamp": "ISO-8601"
}
```

**Feedback Submission:**

```json
{
  "user_query": "Original question",
  "bot_response": "Bot's answer",
  "user_expected_response": "User's feedback text",
  "user_rating": 1-5
}
```

## Session Management

### User Identification

- **UUID Generation**: Each user receives a unique UUID on first visit
- **LocalStorage**: UUID stored persistently in browser
- **Session Persistence**: UUID used to track user across sessions

```javascript
const storedUserId = localStorage.getItem('user_id');
if (!storedUserId) {
  const uniqueUserId = uuidv4();
  localStorage.setItem('user_id', uniqueUserId);
}
```

## UI/UX Architecture

### Styling Approach

1. **Bootstrap 5.3**: Grid system and utility classes
2. **Custom CSS**: `chatbot.css` for component-specific styles
3. **Material-UI**: Rating component and theme
4. **React Chat Elements**: Pre-built chat UI components

### Responsive Design

- Mobile-first approach
- Flexible layouts using Bootstrap grid
- Dynamic sizing based on viewport
- Touch-friendly interface elements

### Loading States

- Spinner icon (FontAwesome) during message processing
- Disabled input during loading
- Visual feedback for user actions

## Build and Deployment Architecture

### Development Build

```
npm start
  ↓
react-scripts start
  ↓
Webpack Dev Server (Port 3000)
  ↓
Hot Module Replacement
```

### Production Build

```
npm run build
  ↓
react-scripts build
  ↓
Optimized Static Files
  ↓
/build directory
```

### Docker Multi-Stage Build

**Stage 1: Build**

- Base: node:18-alpine3.20
- Install dependencies
- Run production build
- Output: Optimized static files

**Stage 2: Production**

- Base: node:18-alpine3.20
- Install PM2 and Express
- Copy build artifacts
- Serve via Express on port 4500

### Process Management

- **PM2**: Production process manager
- **Express**: Static file server
- **Nginx**: Reverse proxy (optional)

## Security Considerations

### Authentication Security

1. **Token Storage**: Secure token handling via MSAL
2. **HTTPS Only**: Enforce secure connections
3. **Token Expiration**: Automatic token refresh
4. **CORS**: Proper CORS configuration

### WebSocket Security

1. **WSS Protocol**: Encrypted WebSocket connections
2. **Authentication**: Token-based WS authentication
3. **Input Validation**: Sanitize user inputs
4. **Rate Limiting**: Prevent abuse

### Data Privacy

1. **User IDs**: Anonymous UUID-based identification
2. **No PII Storage**: Minimal personal data collection
3. **Secure Transmission**: All data encrypted in transit

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**: Lazy loading of components
2. **Minification**: Production build optimization
3. **Caching**: Browser caching strategies
4. **Bundle Size**: Optimized dependencies

### WebSocket Optimization

1. **Connection Pooling**: Reuse connections
2. **Message Batching**: Reduce overhead
3. **Compression**: WebSocket compression
4. **Reconnection Logic**: Automatic reconnection

## Error Handling

### Frontend Error Handling

```javascript
try {
  // WebSocket operations
} catch (error) {
  console.error('WebSocket error:', error);
  // Show user-friendly error message
}
```

### Error States

1. **Connection Errors**: Display reconnection UI
2. **Authentication Errors**: Redirect to login
3. **Message Errors**: Retry mechanism
4. **Validation Errors**: Inline error messages

## Scalability Considerations

### Horizontal Scaling

- Stateless frontend design
- Load balancer compatible
- Session affinity for WebSocket

### Vertical Scaling

- Optimized bundle size
- Efficient state management
- Memory-conscious component design

## Technology Stack Summary

| Layer                       | Technologies                                         |
|-----------------------------|------------------------------------------------------|
| **Frontend Framework**      | React 18.2                                           |
| **UI Components**           | Bootstrap 5.3, Material-UI 5.15, React Chat Elements |
| **State Management**        | React Hooks (useState, useEffect, useRef)            |
| **Authentication**          | Azure MSAL 3.7, Google OAuth                         |
| **Real-time Communication** | WebSocket, Socket.IO 4.7                             |
| **HTTP Client**             | Axios 1.6                                            |
| **Routing**                 | React Router 6.17                                    |
| **Icons**                   | FontAwesome 6.5                                      |
| **Build Tool**              | Create React App (React Scripts 5.0)                 |
| **Process Manager**         | PM2                                                  |
| **Web Server**              | Express 4.21, Nginx                                  |
| **Containerization**        | Docker                                               |

## Future Architecture Enhancements

### Potential Improvements

1. **State Management**: Consider Redux or Zustand for complex state
2. **Offline Support**: Service workers and PWA capabilities
3. **Caching Layer**: Redis for session management
4. **API Gateway**: Centralized API management
5. **Monitoring**: Application performance monitoring (APM)
6. **Analytics**: User behavior tracking
7. **A/B Testing**: Feature flag system
8. **Internationalization**: Multi-language support

### Microservices Evolution

```
Current: Monolithic Frontend
  ↓
Future: Micro-frontends
  ├── Chat Module
  ├── Auth Module
  ├── Feedback Module
  └── Analytics Module
```

## Diagrams

### Sequence Diagram: User Message Flow

```
User → ChatBot: Enter message
ChatBot → WebSocket: Send message
WebSocket → Backend: Forward message
Backend → AI Engine: Process message
AI Engine → Backend: Generate response
Backend → WebSocket: Send response
WebSocket → ChatBot: Receive response
ChatBot → UI: Display response
UI → User: Show message
```

### Sequence Diagram: Authentication Flow

```
User → App: Click login
App → MSAL: Initiate auth
MSAL → Azure AD: Redirect
Azure AD → User: Login page
User → Azure AD: Credentials
Azure AD → MSAL: Token
MSAL → App: Auth success
App → ChatBot: Enable chat
```

## Conclusion

The Omnivoltaic Assist ChatBot architecture is designed for scalability, security, and maintainability. The modular
component structure, combined with modern React patterns, WebSocket communication to
`wss://oves-bot.omnivoltaic.com/chat`, and robust authentication, provides a solid foundation for future enhancements
and feature additions.
