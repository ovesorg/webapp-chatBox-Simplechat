# Changelog

All notable changes to the Omnivoltaic Assist ChatBot project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Multi-language support (i18n)
- Voice input/output capabilities
- File upload and sharing
- Message history persistence
- Typing indicators
- Read receipts
- Dark mode theme

## [1.0.0] - 2025-10-08

### Added

- Initial release of Omnivoltaic Assist ChatBot
- WebSocket connection to `wss://oves-bot.omnivoltaic.com/chat`
- Real-time chat interface using WebSocket
- Azure Active Directory (MSAL) authentication
- Google OAuth authentication
- User feedback system with 1-5 star rating
- Text feedback collection
- UUID-based user identification
- Session management with localStorage
- Responsive UI with Bootstrap and Material-UI
- Docker support with multi-stage build
- PM2 process management for production
- Nginx reverse proxy configuration
- React Chat Elements integration
- FontAwesome icons
- Toast notifications for user feedback

### Features

- **Chat Interface**
    - Real-time bidirectional communication
    - Message display with timestamps
    - User and bot message differentiation
    - Loading states during message processing

- **Authentication**
    - Azure AD login with MSAL
    - Google OAuth login
    - Secure token management
    - Session persistence

- **Feedback System**
    - Star rating (1-5)
    - Optional text feedback
    - Feedback submission via WebSocket

- **User Experience**
    - Mobile-responsive design
    - Intuitive chat interface
    - Error handling and notifications
    - Smooth animations and transitions

### Technical

- React 18.2 with functional components and hooks
- WebSocket for real-time communication
- Socket.IO 4.7 integration
- Axios for HTTP requests
- React Router 6.17 for navigation
- Create React App build system
- Docker containerization
- Express server for production
- PM2 for process management

### Security

- HTTPS/WSS support
- Secure authentication flows
- Token-based authorization
- Input validation
- XSS protection

### Documentation

- Comprehensive README
- Architecture documentation
- API documentation
- Contributing guidelines
- Deployment guide
- Code examples and best practices

## [0.1.0] - 2025-09-15

### Added

- Initial project setup with Create React App
- Basic chat interface prototype
- WebSocket connection implementation
- Azure AD authentication setup
- Project structure and organization

---

## Version History

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

### Release Types

- **[Unreleased]**: Changes in development, not yet released
- **[X.Y.Z]**: Released versions with date

### Change Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

## Migration Guides

### Upgrading to 1.0.0

This is the first stable release. No migration needed.

---

## Support

For questions about specific versions or upgrade paths, please:

- Check the [documentation](../README.md)
- Open an [issue](https://github.com/ovesorg/webapp-chatBox-Simplechat/issues)
- Contact the development team

---

**Note**: This changelog is maintained manually. Please update it with each release.
