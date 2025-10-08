# Omnivoltaic Assist - ChatBot Web Application

A modern, real-time chatbot web application built with React, featuring WebSocket communication to
`wss://oves-bot.omnivoltaic.com`, with user feedback capabilities.

> **⚡ Quick Start**: New to the project? Check out the [Quick Start Guide](./QUICKSTART.md) to get running in 5 minutes!

## 🚀 Features

- **Real-time Chat**: WebSocket-based communication for instant messaging
- **User Feedback**: Rating system and feedback collection
- **Responsive UI**: Modern, mobile-friendly interface built with React and Bootstrap
- **Session Management**: Persistent user sessions with UUID-based identification
- **Docker Support**: Containerized deployment with PM2 process management

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or pnpm package manager
- Docker (optional, for containerized deployment)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ovesorg/webapp-chatBox-Simplechat.git
   cd webapp-chatBox-Simplechat
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

3. **Configure authentication**
   - Update `src/pages/authConfig.js` with your Azure AD credentials
   - Configure Google OAuth settings if needed

4. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t oves-chatbot .
   ```

2. **Run the container**
   ```bash
   docker run -p 4500:4500 oves-chatbot
   ```
   Access the application at [http://localhost:4500](http://localhost:4500)

## 📦 Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page auto-reloads on changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. The build is optimized and minified.

### `npm run eject`

**Warning**: This is a one-way operation. Ejects from Create React App for full configuration control.

## 🏗️ Project Structure

```
webapp-chatBox-Simplechat/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   └── Emoji.jsx
│   ├── pages/          # Page components
│   │   ├── Authentication.jsx
│   │   ├── Authentification.css
│   │   └── authConfig.js
│   ├── App.js          # Main application component
│   ├── chatbot.js      # Core chatbot logic
│   ├── chatbot.css     # Chatbot styling
│   └── index.js        # Application entry point
├── nginx/              # Nginx configuration
├── docker/             # Docker-related files
├── Dockerfile          # Multi-stage Docker build
├── server.js           # Express server for production
└── package.json        # Project dependencies
```

## 🔑 Key Technologies

- **Frontend**: React 18.2, React Router 6.17
- **UI Framework**: Bootstrap 5.3, Material-UI 5.15
- **Authentication**: Azure MSAL 3.7, Google OAuth
- **Real-time Communication**: WebSocket, Socket.IO 4.7
- **HTTP Client**: Axios 1.6
- **Icons**: FontAwesome 6.5
- **Build Tool**: React Scripts 5.0
- **Process Manager**: PM2 (production)
- **Web Server**: Express 4.21, Nginx

## 🔐 Authentication

The application supports two authentication methods:

1. **Azure Active Directory**: Configured via `@azure/msal-browser` and `@azure/msal-react`
2. **Google OAuth**: Integrated using `@react-oauth/google`

Configure authentication settings in `src/pages/authConfig.js`.

## 🌐 WebSocket Communication

The chatbot uses WebSocket for real-time bidirectional communication:

- User messages are sent via WebSocket
- Bot responses are received in real-time
- Feedback and ratings are transmitted through the same connection

## 📊 User Feedback System

Users can provide feedback on bot responses:

- **Rating**: 1-5 star rating system (Material-UI Rating component)
- **Text Feedback**: Optional text input for detailed feedback
- **Data Collection**: Feedback is sent via WebSocket for analysis

## 🐳 Docker Configuration

The application uses a multi-stage Docker build:

1. **Build Stage**: Compiles the React application
2. **Production Stage**: Serves the build with Express and PM2

Port: `4500` (configurable in Dockerfile and server.js)

## 📝 Environment Variables

Configure the following in your deployment environment:

- Azure AD client ID and tenant ID
- Google OAuth credentials
- WebSocket server URL: `wss://oves-bot.omnivoltaic.com/chat`
- API endpoints

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and contribution process.

## 📖 Additional Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and architecture
- [API Documentation](./docs/API.md) - API endpoints and WebSocket protocol
- [Deployment Guide](./docs/DEPLOYMENT.md) - Detailed deployment instructions

## 🐛 Troubleshooting

### Build Issues

If `npm run build` fails to minify, see
the [Create React App troubleshooting guide](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).

### Dependency Conflicts

Use `--legacy-peer-deps` flag when installing dependencies to resolve peer dependency conflicts.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🤝 Community

- **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Our community standards
- **[Contributing](./CONTRIBUTING.md)** - How to contribute
- **[Contributors](./CONTRIBUTORS.md)** - Our amazing contributors
- **[Governance](./GOVERNANCE.md)** - Project governance model
- **[Support](./SUPPORT.md)** - Getting help

## 🙏 Acknowledgments

See [ACKNOWLEDGMENTS.md](./ACKNOWLEDGMENTS.md) for the list of open-source projects and contributors that made this
possible.

## 👥 Support

For support and questions, please contact the Omnivoltaic development team.

**Website**: [omnivoltaic.com](https://omnivoltaic.com)  
**Support**: See [SUPPORT.md](./SUPPORT.md) for all support options
