# Quick Start Guide

Get Omnivoltaic Assist ChatBot running in 5 minutes! ⚡

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- npm or pnpm package manager
- A code editor (VS Code recommended)

## 🚀 Option 1: Local Development (Fastest)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/ovesorg/webapp-chatBox-Simplechat.git
cd webapp-chatBox-Simplechat

# Install dependencies
npm install --legacy-peer-deps
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials (optional for basic testing)
# You can skip this for initial testing
```

### Step 3: Start Development Server

```bash
npm start
```

**That's it!** 🎉 Open [http://localhost:3000](http://localhost:3000)

## 🐳 Option 2: Docker (Production-like)

### Step 1: Build Docker Image

```bash
docker build -t oves-chatbot .
```

### Step 2: Run Container

```bash
docker run -p 4500:4500 oves-chatbot
```

**Done!** 🎉 Open [http://localhost:4500](http://localhost:4500)

## 🔧 Basic Configuration

### Minimum Configuration (Optional)

For basic testing, you can run without authentication. For full features:

1. **Get Azure AD Credentials** (Optional)
    - Go to [Azure Portal](https://portal.azure.com)
    - Create App Registration
    - Copy Client ID and Tenant ID

2. **Get Google OAuth Credentials** (Optional)
    - Go to [Google Cloud Console](https://console.cloud.google.com)
    - Create OAuth Client ID
    - Copy Client ID

3. **Update `.env`**
   ```bash
   REACT_APP_AZURE_CLIENT_ID=your-client-id
   REACT_APP_AZURE_TENANT_ID=your-tenant-id
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_WS_URL=wss://oves-bot.omnivoltaic.com/chat
   ```

## ✅ Verify Installation

### Check if it's working:

1. **Open the app** in your browser
2. **You should see** the chat interface
3. **Try typing** a message (may need backend connection)

### Common Issues

**Port already in use?**

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

**Dependencies won't install?**

```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

**Build fails?**

```bash
# Increase memory
NODE_OPTIONS=--max_old_space_size=4096 npm start
```

## 📚 Next Steps

### For Users

- Read the [README](./README.md) for full features
- Check [FAQ](./docs/FAQ.md) for common questions
- See [Troubleshooting](./docs/TROUBLESHOOTING.md) if issues arise

### For Developers

- Review [Architecture](./docs/ARCHITECTURE.md) to understand the system
- Read [Contributing Guidelines](./CONTRIBUTING.md) to contribute
- Check [API Documentation](./docs/API.md) for integration

### For DevOps

- See [Deployment Guide](./docs/DEPLOYMENT.md) for production deployment
- Review [Security Policy](./docs/SECURITY.md) for best practices
- Check [Docker configuration](./Dockerfile) for customization

## 🎯 Quick Commands

```bash
# Development
npm start              # Start dev server
npm test               # Run tests
npm run build          # Build for production

# Docker
docker build -t oves-chatbot .           # Build image
docker run -p 4500:4500 oves-chatbot    # Run container
docker logs <container-id>               # View logs

# Utilities
npm install --legacy-peer-deps           # Install dependencies
npm audit                                # Check security
npm outdated                             # Check updates
```

## 🆘 Getting Help

- **Documentation**: Check [docs/](./docs/) directory
- **Website**: [omnivoltaic.com](https://omnivoltaic.com)
- **Issues**: Search [GitHub Issues](https://github.com/ovesorg/webapp-chatBox-Simplechat/issues)
- **Questions**: Open a [Discussion](https://github.com/ovesorg/webapp-chatBox-Simplechat/discussions)

## 🎓 Learning Resources

### Tutorials

1. **First Steps**: [README.md](./README.md)
2. **Understanding the Code**: [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
3. **Making Changes**: [CONTRIBUTING.md](./CONTRIBUTING.md)
4. **Deploying**: [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### Video Tutorials (Coming Soon)

- Installation walkthrough
- First contribution guide
- Deployment tutorial

## 💡 Tips

### Development Tips

- **Hot Reload**: Changes auto-reload in development
- **Console**: Check browser console (F12) for errors
- **Network Tab**: Monitor WebSocket connections
- **React DevTools**: Install for better debugging

### Performance Tips

- **Production Build**: Always use `npm run build` for production
- **Caching**: Enable browser caching for better performance
- **CDN**: Consider using CDN for static assets

### Security Tips

- **Never commit** `.env` file
- **Use environment variables** for secrets
- **Enable HTTPS** in production
- **Keep dependencies** updated

## 🔄 Update Guide

### Updating to Latest Version

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install --legacy-peer-deps

# Restart server
npm start
```

### Migration Guides

Check [CHANGELOG.md](./docs/CHANGELOG.md) for version-specific migration instructions.

## 📊 Project Status

- **Version**: 1.0.0
- **Status**: ✅ Stable
- **Last Updated**: 2025-10-08
- **Node Version**: 18.x+
- **WebSocket**: wss://oves-bot.omnivoltaic.com/chat
- **License**: [See LICENSE file]

## 🌟 Features at a Glance

- ✅ Real-time chat with WebSocket
- ✅ Azure AD & Google OAuth authentication
- ✅ User feedback system
- ✅ Responsive design
- ✅ Docker support
- ✅ Comprehensive documentation

## 🗺️ What's Next?

Check the [Roadmap](./docs/ROADMAP.md) for upcoming features:

- Message history
- File upload
- Dark mode
- Multi-language support
- Voice input/output
- Mobile app

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Code of conduct
- Development workflow
- Coding standards
- Pull request process

## 📝 Feedback

Your feedback helps us improve!

- **Feature Requests
  **: [Open an issue](https://github.com/ovesorg/webapp-chatBox-Simplechat/issues/new?template=feature_request.md)
- **Bug Reports
  **: [Report a bug](https://github.com/ovesorg/webapp-chatBox-Simplechat/issues/new?template=bug_report.md)
- **General Feedback**: Visit [omnivoltaic.com](https://omnivoltaic.com)

---

## 🎉 You're All Set!

You now have OVES ChatBot running locally. Happy coding! 🚀

**Need help?** Check the [FAQ](./docs/FAQ.md) or open an issue.

**Want to contribute?** Read the [Contributing Guide](./CONTRIBUTING.md).

**Ready to deploy?** See the [Deployment Guide](./docs/DEPLOYMENT.md).

---

**Last Updated**: 2025-10-08

For detailed documentation, see [README.md](./README.md) or browse the [docs/](./docs/) directory.
