# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the OVES ChatBot application.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [Authentication Issues](#authentication-issues)
- [WebSocket Issues](#websocket-issues)
- [Docker Issues](#docker-issues)
- [Performance Issues](#performance-issues)
- [Browser Issues](#browser-issues)

## Installation Issues

### npm install fails with peer dependency errors

**Symptoms:**

```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! Could not resolve dependency
```

**Solution:**

```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or use --force (less recommended)
npm install --force

# Alternative: Use pnpm
npm install -g pnpm
pnpm install
```

### Node version incompatibility

**Symptoms:**

```
error: The engine "node" is incompatible with this module
```

**Solution:**

```bash
# Check Node version
node --version

# Should be 18.x or higher
# Install correct version using nvm
nvm install 18
nvm use 18

# Verify
node --version
```

### Installation hangs or is very slow

**Symptoms:**

- Installation takes more than 10 minutes
- Process appears frozen

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install --legacy-peer-deps

# Try different registry
npm config set registry https://registry.npmjs.org/
```

### Permission errors on Linux/Mac

**Symptoms:**

```
EACCES: permission denied
```

**Solution:**

```bash
# Don't use sudo! Instead, fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then reinstall
npm install --legacy-peer-deps
```

## Build Issues

### Build fails with "JavaScript heap out of memory"

**Symptoms:**

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**

```bash
# Increase Node memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build

# Or add to package.json scripts
"build": "NODE_OPTIONS=--max_old_space_size=4096 react-scripts build"
```

### Build fails with module not found errors

**Symptoms:**

```
Module not found: Can't resolve 'module-name'
```

**Solutions:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check for typos in import statements
# Verify the module is in package.json

# Clear build cache
rm -rf build
npm run build
```

### Build succeeds but app doesn't work

**Symptoms:**

- Build completes without errors
- Deployed app shows blank page or errors

**Solutions:**

```bash
# Check browser console for errors
# Common issues:

# 1. Incorrect homepage in package.json
# If deploying to subdirectory, set:
"homepage": "https://yourdomain.com/subdirectory"

# 2. Missing environment variables
# Ensure all REACT_APP_* variables are set during build

# 3. Test build locally
npm run build
npx serve -s build
# Open http://localhost:3000
```

### CSS/styling issues after build

**Symptoms:**

- Styles work in development but not in production
- Missing styles in build

**Solutions:**

```bash
# Ensure CSS imports are correct
# ✅ Good
import './styles.css';

# ❌ Bad (might work in dev but fail in prod)
import 'styles.css';

# Check for CSS module naming
# CSS modules should end with .module.css
import styles from './Component.module.css';

# Rebuild
npm run build
```

## Runtime Issues

### Application shows blank page

**Symptoms:**

- White/blank screen
- No errors visible

**Diagnosis:**

```bash
# 1. Open browser console (F12)
# Look for errors

# 2. Check network tab
# Look for failed requests

# 3. Check if JavaScript is enabled
```

**Solutions:**

**If console shows errors:**

```javascript
// Common error: "Cannot read property of undefined"
// Check for missing null checks

// ❌ Bad
const name = user.profile.name;

// ✅ Good
const name = user?.profile?.name || 'Unknown';
```

**If no errors in console:**

```bash
# Check if build is correct
# Verify index.html exists in build folder
# Check if static files are being served correctly
```

### Application crashes on specific actions

**Symptoms:**

- App works initially but crashes when performing certain actions
- Error boundaries triggered

**Diagnosis:**

```javascript
// Add error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    return this.props.children;
  }
}

// Wrap app
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Solutions:**

- Check console for error details
- Add null checks for data
- Validate props with PropTypes
- Add loading states

### State not updating

**Symptoms:**

- UI doesn't reflect state changes
- setState appears not to work

**Common Causes:**

```javascript
// ❌ Bad: Mutating state directly
this.state.messages.push(newMessage);

// ✅ Good: Create new array
setMessages([...messages, newMessage]);

// ❌ Bad: Async setState timing
setCount(count + 1);
setCount(count + 1); // Still uses old count

// ✅ Good: Use functional update
setCount(c => c + 1);
setCount(c => c + 1);
```

## Authentication Issues

### Azure AD login fails

**Symptoms:**

```
AADSTS50011: The reply URL specified in the request does not match
```

**Solution:**

```bash
# 1. Check Azure Portal > App Registration > Authentication
# 2. Ensure redirect URI matches exactly
# 3. Include both:
#    - http://localhost:3000 (development)
#    - https://yourdomain.com (production)

# 4. Update authConfig.js
export const msalConfig = {
  auth: {
    clientId: "correct-client-id",
    authority: "https://login.microsoftonline.com/correct-tenant-id",
    redirectUri: window.location.origin
  }
};
```

### Google OAuth popup blocked

**Symptoms:**

- Login popup doesn't appear
- Console shows popup blocked warning

**Solutions:**

```javascript
// 1. Use redirect flow instead of popup
const login = useGoogleLogin({
  flow: 'auth-code',
  ux_mode: 'redirect'
});

// 2. Trigger login from user action
<button onClick={login}>Login with Google</button>

// 3. Instruct users to allow popups for your domain
```

### Token expired errors

**Symptoms:**

```
Token expired or invalid
```

**Solution:**

```javascript
// Implement token refresh
const acquireToken = async () => {
  const request = {
    scopes: ["User.Read"],
    account: instance.getActiveAccount()
  };
  
  try {
    // Try silent token acquisition
    const response = await instance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    // Fall back to interactive
    const response = await instance.acquireTokenPopup(request);
    return response.accessToken;
  }
};
```

### User not redirected after login

**Symptoms:**

- Login succeeds but user stays on login page
- No redirect after authentication

**Solution:**

```javascript
// Check redirect logic
const { instance, accounts } = useMsal();

useEffect(() => {
  if (accounts.length > 0) {
    // User is authenticated, redirect
    navigate('/chat');
  }
}, [accounts, navigate]);
```

## WebSocket Issues

### WebSocket connection fails

**Symptoms:**

```
WebSocket connection to 'ws://...' failed
```

**Diagnosis:**

```javascript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  console.log('Close code:', event.code);
  console.log('Close reason:', event.reason);
};
```

**Solutions:**

**1. Protocol mismatch (HTTP vs HTTPS)**

```javascript
// ❌ Bad: Hardcoded protocol
const ws = new WebSocket('ws://api.example.com');

// ✅ Good: Match page protocol
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//api.example.com`);
```

**2. CORS/Firewall issues**

```bash
# Check if WebSocket port is accessible
telnet ws-server.com 8080

# Check browser console for CORS errors
# Configure server to allow WebSocket connections
```

**3. Proxy configuration**

```javascript
// For development with Create React App
// Add to package.json:
"proxy": {
  "/ws": {
    "target": "ws://localhost:8080",
    "ws": true
  }
}
```

### WebSocket disconnects randomly

**Symptoms:**

- Connection drops after period of inactivity
- Frequent reconnections

**Solution:**

```javascript
// Implement heartbeat/ping-pong
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

let heartbeatTimer;

ws.onopen = () => {
  heartbeatTimer = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, HEARTBEAT_INTERVAL);
};

ws.onclose = () => {
  clearInterval(heartbeatTimer);
};

// Implement reconnection logic
const connect = () => {
  const ws = new WebSocket(url);
  
  ws.onclose = () => {
    console.log('Disconnected, reconnecting in 5s...');
    setTimeout(connect, 5000);
  };
};
```

### Messages not being received

**Symptoms:**

- Messages sent but no response
- onmessage handler not triggered

**Diagnosis:**

```javascript
ws.onmessage = (event) => {
  console.log('Raw message:', event.data);
  
  try {
    const data = JSON.parse(event.data);
    console.log('Parsed message:', data);
  } catch (error) {
    console.error('Parse error:', error);
  }
};
```

**Solutions:**

- Verify message format matches expected schema
- Check if WebSocket is in OPEN state before sending
- Verify backend is sending responses
- Check for JSON parsing errors

## Docker Issues

### Docker build fails

**Symptoms:**

```
ERROR [build 5/6] RUN npm install --legacy-peer-deps
```

**Solutions:**

```bash
# Clear Docker cache
docker builder prune

# Build without cache
docker build --no-cache -t oves-chatbot .

# Check Dockerfile syntax
# Ensure COPY paths are correct
```

### Container exits immediately

**Symptoms:**

```
docker ps shows no running containers
```

**Diagnosis:**

```bash
# Check logs
docker logs container-name

# Run interactively
docker run -it oves-chatbot sh

# Check if port is already in use
netstat -tuln | grep 4500
```

**Solutions:**

```bash
# Fix port conflicts
docker run -p 4501:4500 oves-chatbot

# Check environment variables
docker run -e DEBUG=* oves-chatbot

# Verify CMD/ENTRYPOINT in Dockerfile
```

### Cannot access application in Docker

**Symptoms:**

- Container running but can't access http://localhost:4500
- Connection refused

**Solutions:**

```bash
# Ensure port is mapped
docker run -p 4500:4500 oves-chatbot

# Check if app is listening on 0.0.0.0, not 127.0.0.1
# In server.js:
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

# Check Docker network
docker network ls
docker network inspect bridge
```

## Performance Issues

### Slow initial load

**Symptoms:**

- First page load takes more than 5 seconds
- Large bundle size

**Solutions:**

```bash
# Analyze bundle size
npm run build
# Check build output for large chunks

# Implement code splitting
import React, { lazy, Suspense } from 'react';

const ChatBot = lazy(() => import('./chatbot'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatBot />
    </Suspense>
  );
}

# Enable compression in server
# See nginx configuration in DEPLOYMENT.md
```

### High memory usage

**Symptoms:**

- Browser tab uses excessive memory
- Application becomes sluggish over time

**Solutions:**

```javascript
// Clean up WebSocket connections
useEffect(() => {
  const ws = new WebSocket(url);
  
  return () => {
    ws.close(); // Cleanup on unmount
  };
}, []);

// Clean up event listeners
useEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);

// Limit message history
const MAX_MESSAGES = 100;
setMessages(prev => prev.slice(-MAX_MESSAGES));
```

### UI freezes or lags

**Symptoms:**

- Interface becomes unresponsive
- Delayed reactions to user input

**Solutions:**

```javascript
// Debounce expensive operations
import { debounce } from 'lodash';

const handleInput = debounce((value) => {
  // Expensive operation
}, 300);

// Use React.memo for expensive components
const MessageList = React.memo(({ messages }) => {
  return messages.map(msg => <Message key={msg.id} {...msg} />);
});

// Virtualize long lists
import { FixedSizeList } from 'react-window';
```

## Browser Issues

### Works in Chrome but not Firefox/Safari

**Symptoms:**

- Application works in one browser but not others

**Solutions:**

```bash
# Check browser console for specific errors

# Common issues:
# 1. Missing polyfills
npm install react-app-polyfill

# Add to index.js (top):
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

# 2. CSS vendor prefixes
# Use autoprefixer (included in CRA)

# 3. JavaScript features not supported
# Check caniuse.com for compatibility
# Use Babel to transpile
```

### Mobile browser issues

**Symptoms:**

- Works on desktop but not mobile
- Layout broken on mobile

**Solutions:**

```css
/* Add viewport meta tag in public/index.html */
<meta name="viewport" content="width=device-width, initial-scale=1" />

/* Use responsive CSS */
@media (max-width: 768px) {
  .chat-container {
    width: 100%;
    padding: 10px;
  }
}

/* Test on actual devices or use browser dev tools */
```

## Getting More Help

### Enable Debug Mode

```bash
# Set environment variable
DEBUG=* npm start

# Or in code
localStorage.setItem('debug', 'true');
```

### Collect Diagnostic Information

```bash
# System info
node --version
npm --version
cat package.json

# Browser info
# Open console and run:
navigator.userAgent

# Network info
# Check Network tab in DevTools
# Export HAR file for analysis
```

### Where to Get Help

1. **Check Documentation**: Review [FAQ](./FAQ.md)
2. **Search Issues**: Check [GitHub Issues](https://github.com/ovesorg/webapp-chatBox-Simplechat/issues)
3. **Ask Community**: Use GitHub Discussions
4. **Contact Support**: Email dev@oves.org

### Reporting Issues

When reporting issues, include:

- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node version)
- Console errors and logs
- Screenshots if applicable

Use the [Bug Report Template](../.github/ISSUE_TEMPLATE/bug_report.md)

---

**Last Updated**: 2025-10-07

If your issue isn't covered here, please open an issue on GitHub or contact the development team.
