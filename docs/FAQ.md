# Frequently Asked Questions (FAQ)

## General Questions

### What is Omnivoltaic Assist?

Omnivoltaic Assist is a modern, real-time web-based chatbot application built with React. It features WebSocket
communication to `wss://oves-bot.omnivoltaic.com/chat` for instant messaging, Azure AD and Google OAuth authentication,
and a user feedback system.

### What technologies does it use?

- **Frontend**: React 18.2, Bootstrap 5.3, Material-UI 5.15
- **Authentication**: Azure MSAL, Google OAuth
- **Real-time Communication**: WebSocket, Socket.IO
- **Build Tool**: Create React App
- **Deployment**: Docker, PM2, Nginx

### Is it open source?

[Add your license information here - check with your team]

### Who maintains this project?

This project is maintained by the OVES development team.

## Installation & Setup

### What are the system requirements?

- Node.js 18.x or higher
- npm 9.x or higher (or pnpm 8.x+)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Docker 20.x+ (optional, for containerized deployment)

### Why do I need to use `--legacy-peer-deps`?

Some dependencies have peer dependency conflicts. The `--legacy-peer-deps` flag tells npm to use the legacy peer
dependency resolution algorithm, which is more permissive.

```bash
npm install --legacy-peer-deps
```

### How do I get Azure AD credentials?

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Configure your app and note the Client ID and Tenant ID
5. Add redirect URIs under "Authentication"
6. Update `src/pages/authConfig.js` with your credentials

### How do I get Google OAuth credentials?

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure OAuth consent screen
6. Note the Client ID
7. Update your environment variables

### Can I use this without authentication?

The current implementation requires authentication. To disable it, you would need to:

1. Remove the `MsalProvider` wrapper in `App.js`
2. Remove authentication checks in `ChatBot.js`
3. Modify the authentication flow

However, this is not recommended for production use.

## Development

### How do I start the development server?

```bash
npm start
```

The app will open at `http://localhost:3000` with hot reloading enabled.

### How do I run tests?

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### How do I build for production?

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Can I use yarn or pnpm instead of npm?

Yes! The project works with:

- **npm**: `npm install --legacy-peer-deps`
- **pnpm**: `pnpm install`
- **yarn**: `yarn install`

### How do I add a new component?

1. Create component file: `src/components/MyComponent.jsx`
2. Write component code following the style guide
3. Add PropTypes validation
4. Create corresponding CSS file (optional)
5. Export the component
6. Import and use in parent component

Example:

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function MyComponent({ title }) {
  return <div>{title}</div>;
}

MyComponent.propTypes = {
  title: PropTypes.string.isRequired
};

export default MyComponent;
```

## WebSocket & Communication

### How does the WebSocket connection work?

The application establishes a WebSocket connection to the backend server when the chat interface loads. Messages are
sent and received in real-time through this persistent connection.

### What happens if the WebSocket disconnects?

The application should implement reconnection logic. Check `src/chatbot.js` for the current implementation. You may need
to add automatic reconnection if not already present.

### Can I change the WebSocket URL?

Yes, update the `REACT_APP_WS_URL` environment variable:

```bash
# .env file
# Production (default)
REACT_APP_WS_URL=wss://oves-bot.omnivoltaic.com/chat

# Development
REACT_APP_WS_URL=ws://localhost:8080
```

### What message format does the WebSocket use?

Messages are JSON formatted. See [API Documentation](./API.md) for detailed message schemas.

## Authentication

### Why am I getting authentication errors?

Common causes:

1. **Incorrect credentials**: Verify Client ID and Tenant ID
2. **Wrong redirect URI**: Must match exactly in Azure/Google console
3. **Expired tokens**: Clear browser cache and re-authenticate
4. **Network issues**: Check firewall and proxy settings

### How long do authentication tokens last?

- **Azure AD**: Typically 1 hour (configurable)
- **Google OAuth**: Typically 1 hour

Tokens are automatically refreshed when possible.

### Can I use multiple authentication providers simultaneously?

The current implementation supports both Azure AD and Google OAuth, but users choose one method per session. To support
multiple simultaneous providers, you'd need to modify the authentication logic.

### How do I logout?

For Azure AD:

```javascript
const { instance } = useMsal();
instance.logoutPopup();
```

For Google OAuth, the implementation depends on your specific setup.

## Deployment

### How do I deploy to production?

See the comprehensive [Deployment Guide](./DEPLOYMENT.md) for detailed instructions for various platforms:

- Docker
- AWS (Elastic Beanstalk, ECS)
- Google Cloud Platform (Cloud Run)
- Azure (App Service)
- Kubernetes

### Do I need Docker to deploy?

No, Docker is optional. You can:

1. Build the app: `npm run build`
2. Serve the build folder with any static file server
3. Use the included Express server: `node server.js`

### What port does the application use?

- **Development**: 3000 (default Create React App port)
- **Production**: 4500 (configurable via PORT environment variable)

### How do I configure SSL/HTTPS?

For production, use a reverse proxy like Nginx:

1. Obtain SSL certificates (Let's Encrypt, commercial CA)
2. Configure Nginx with SSL (see [Deployment Guide](./DEPLOYMENT.md))
3. Redirect HTTP to HTTPS

### Can I deploy to a subdirectory?

Yes, set the `homepage` field in `package.json`:

```json
{
  "homepage": "https://yourdomain.com/chatbot"
}
```

Then rebuild the application.

## Performance

### The application is slow. How can I improve performance?

1. **Enable production build**: Always use `npm run build` for production
2. **Enable gzip**: Configure your web server to compress responses
3. **Use CDN**: Serve static assets from a CDN
4. **Optimize images**: Compress and resize images
5. **Code splitting**: Implement lazy loading for components
6. **Caching**: Configure proper cache headers

### How can I reduce the bundle size?

1. **Analyze bundle**: `npm run build` shows bundle size
2. **Remove unused dependencies**: Check `package.json`
3. **Use tree shaking**: Ensure you're importing only what you need
4. **Lazy load components**: Use `React.lazy()` and `Suspense`
5. **Optimize images**: Use WebP format, compress images

### Why is the initial load slow?

Common causes:

1. Large bundle size
2. No caching configured
3. Slow network connection
4. Server response time
5. No CDN

Solutions:

- Enable code splitting
- Configure browser caching
- Use a CDN
- Optimize server performance
- Implement service workers

## Troubleshooting

### The build fails with memory errors

Increase Node.js memory limit:

```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### I'm getting CORS errors

CORS errors occur when the frontend and backend are on different domains. Solutions:

1. Configure CORS headers on the backend
2. Use a reverse proxy
3. Ensure WebSocket URL is correct

### WebSocket connection fails in production

Common issues:

1. **HTTP vs HTTPS**: Use `wss://` for HTTPS sites, `ws://` for HTTP
2. **Firewall**: Ensure WebSocket port is open
3. **Proxy**: Configure proxy to support WebSocket upgrades
4. **URL**: Verify WebSocket URL is correct

### Authentication popup is blocked

Browser popup blockers may prevent authentication popups. Solutions:

1. Use redirect flow instead of popup
2. Instruct users to allow popups for your domain
3. Trigger authentication from user action (button click)

### The application won't start after pulling latest changes

Try these steps:

```bash
# Clear node modules and cache
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install --legacy-peer-deps

# Clear React cache
rm -rf .cache

# Restart dev server
npm start
```

### Docker container exits immediately

Check logs:

```bash
docker logs container-name
```

Common issues:

- Port already in use
- Missing environment variables
- Build errors
- Incorrect Dockerfile configuration

## Features & Functionality

### How do I customize the chat interface?

1. **Styling**: Edit `src/chatbot.css`
2. **Components**: Modify `src/chatbot.js`
3. **Theme**: Configure Material-UI theme
4. **Bootstrap**: Override Bootstrap variables

### Can I add file upload functionality?

File upload is not currently implemented. To add it:

1. Add file input component
2. Handle file selection
3. Send file via WebSocket or HTTP
4. Update backend to handle file uploads

### How do I add new features?

1. Create a feature branch
2. Implement the feature
3. Add tests
4. Update documentation
5. Submit a pull request

See [Contributing Guidelines](../CONTRIBUTING.md) for details.

### Can I customize the feedback system?

Yes, the feedback system is in `src/chatbot.js`. You can:

- Change rating scale
- Add custom feedback fields
- Modify submission logic
- Customize UI

### How do I add analytics?

1. Choose analytics provider (Google Analytics, Mixpanel, etc.)
2. Add tracking script to `public/index.html`
3. Add event tracking in components
4. Configure privacy settings

Example for Google Analytics:

```javascript
// Track page view
window.gtag('config', 'GA_MEASUREMENT_ID', {
  page_path: window.location.pathname
});

// Track event
window.gtag('event', 'message_sent', {
  event_category: 'chat',
  event_label: 'user_message'
});
```

## Security

### Is the application secure?

The application includes basic security features:

- HTTPS/WSS support
- Secure authentication
- Token-based authorization
- Input validation

For production, ensure:

- SSL certificates configured
- Security headers set
- Regular dependency updates
- Security audits performed

### How do I report a security vulnerability?

Please report security vulnerabilities privately to [security@oves.org] rather than opening a public issue.

### Are user messages encrypted?

- **In transit**: Yes, when using HTTPS/WSS
- **At rest**: Depends on backend implementation

### How is user data stored?

Currently, only a UUID is stored in browser localStorage for user identification. No personal information is stored
client-side. Check backend implementation for server-side storage.

## Contributing

### How can I contribute?

See [Contributing Guidelines](../CONTRIBUTING.md) for detailed instructions. In summary:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### What should I work on?

Check:

- Open issues on GitHub
- Roadmap in documentation
- "good first issue" labels
- Feature requests

### Do I need to sign a CLA?

[Add information about Contributor License Agreement if applicable]

## Support

### Where can I get help?

- **Documentation**: Check the `/docs` directory
- **Issues**: Search [GitHub Issues](https://github.com/ovesorg/webapp-chatBox-Simplechat/issues)
- **Discussions**: Use GitHub Discussions
- **Website**: [omnivoltaic.com](https://omnivoltaic.com)

### How do I report a bug?

1. Check if the bug is already reported
2. Create a new issue on GitHub
    - Description of the bug
    - Steps to reproduce
    - Expected behavior
    - Actual behavior
    - Screenshots (if applicable)
    - Environment details (OS, browser, Node version)

### Can I request a feature?

Yes! Open a feature request issue on GitHub with:

- Description of the feature
- Use case
- Expected behavior
- Mockups or examples (if applicable)

---

## Still Have Questions?

If your question isn't answered here:

1. Check the [documentation](../README.md)
2. Search [existing issues](https://github.com/ovesorg/webapp-chatBox-Simplechat/issues)
3. Open a new issue or discussion
4. Contact the development team

We're here to help! 🚀
