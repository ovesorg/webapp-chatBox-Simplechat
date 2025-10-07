# Deployment Guide

This guide provides comprehensive instructions for deploying the Omnivoltaic Assist ChatBot application in various
environments.

**Production WebSocket**: `wss://oves-bot.omnivoltaic.com/chat`

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Deployment](#local-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Production Checklist](#production-checklist)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (or pnpm 8.x+)
- **Docker**: 20.x or higher (for containerized deployment)
- **Git**: For version control

### Required Credentials

- Azure AD application credentials (Client ID, Tenant ID)
- Google OAuth credentials (Client ID)
- WebSocket server URL
- SSL certificates (for production)

## Environment Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Application
REACT_APP_NAME=OVES ChatBot
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=production

# API Configuration
REACT_APP_API_URL=https://oves-bot.omnivoltaic.com
REACT_APP_WS_URL=wss://oves-bot.omnivoltaic.com/chat

# Azure AD Configuration
REACT_APP_AZURE_CLIENT_ID=your-azure-client-id
REACT_APP_AZURE_TENANT_ID=your-azure-tenant-id
REACT_APP_AZURE_REDIRECT_URI=https://omnivoltaic.com

# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
REACT_APP_ENABLE_FEEDBACK=true
REACT_APP_ENABLE_ANALYTICS=true

# Server Configuration (for production build)
PORT=4500
NODE_ENV=production
```

### Configuration Files

#### 1. Update `src/pages/authConfig.js`

```javascript
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}`,
    redirectUri: process.env.REACT_APP_AZURE_REDIRECT_URI
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};
```

#### 2. Update WebSocket URL in `src/chatbot.js`

```javascript
const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
const ws = new WebSocket(wsUrl);
```

## Local Deployment

### Development Mode

1. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Application runs at `http://localhost:3000`

### Production Build (Local)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve the build**
   ```bash
   npm install -g serve
   serve -s build -l 4500
   ```
   Application runs at `http://localhost:4500`

## Docker Deployment

### Single Container Deployment

#### 1. Build Docker Image

```bash
docker build -t oves-chatbot:latest .
```

#### 2. Run Container

```bash
docker run -d \
  --name oves-chatbot \
  -p 4500:4500 \
  -e REACT_APP_AZURE_CLIENT_ID=your-client-id \
  -e REACT_APP_AZURE_TENANT_ID=your-tenant-id \
  -e REACT_APP_WS_URL=wss://your-ws-url \
  oves-chatbot:latest
```

#### 3. Verify Deployment

```bash
# Check container status
docker ps

# View logs
docker logs oves-chatbot

# Access application
curl http://localhost:4500
```

### Docker Compose Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  chatbot:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: oves-chatbot
    ports:
      - "4500:4500"
    environment:
      - NODE_ENV=production
      - REACT_APP_AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
      - REACT_APP_AZURE_TENANT_ID=${AZURE_TENANT_ID}
      - REACT_APP_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - REACT_APP_WS_URL=${WS_URL}
    restart: unless-stopped
    networks:
      - chatbot-network

  nginx:
    image: nginx:alpine
    container_name: oves-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - chatbot
    restart: unless-stopped
    networks:
      - chatbot-network

networks:
  chatbot-network:
    driver: bridge
```

Deploy with Docker Compose:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Nginx Configuration

Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream chatbot {
        server chatbot:4500;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip Compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

        location / {
            proxy_pass http://chatbot;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket Support
        location /ws {
            proxy_pass http://chatbot;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_read_timeout 86400;
        }
    }
}
```

## Cloud Deployment

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   eb init -p docker oves-chatbot
   ```

3. **Create environment**
   ```bash
   eb create oves-chatbot-prod
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

5. **Set environment variables**
   ```bash
   eb setenv REACT_APP_AZURE_CLIENT_ID=your-client-id \
             REACT_APP_AZURE_TENANT_ID=your-tenant-id \
             REACT_APP_WS_URL=wss://your-ws-url
   ```

#### Using AWS ECS (Fargate)

1. **Create ECR repository**
   ```bash
   aws ecr create-repository --repository-name oves-chatbot
   ```

2. **Build and push image**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
   docker build -t oves-chatbot .
   docker tag oves-chatbot:latest YOUR_ECR_URL/oves-chatbot:latest
   docker push YOUR_ECR_URL/oves-chatbot:latest
   ```

3. **Create ECS task definition** (see AWS console or use CLI)

4. **Create ECS service**

### Google Cloud Platform

#### Using Cloud Run

1. **Build and push to GCR**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/oves-chatbot
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy oves-chatbot \
     --image gcr.io/PROJECT_ID/oves-chatbot \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars REACT_APP_AZURE_CLIENT_ID=your-client-id,REACT_APP_WS_URL=wss://your-ws-url
   ```

### Azure Deployment

#### Using Azure App Service

1. **Create App Service**
   ```bash
   az webapp create --resource-group myResourceGroup \
     --plan myAppServicePlan \
     --name oves-chatbot \
     --runtime "NODE|18-lts"
   ```

2. **Configure deployment**
   ```bash
   az webapp deployment source config-local-git \
     --name oves-chatbot \
     --resource-group myResourceGroup
   ```

3. **Deploy**
   ```bash
   git remote add azure <deployment-url>
   git push azure main
   ```

4. **Set environment variables**
   ```bash
   az webapp config appsettings set \
     --resource-group myResourceGroup \
     --name oves-chatbot \
     --settings REACT_APP_AZURE_CLIENT_ID=your-client-id
   ```

### Kubernetes Deployment

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: oves-chatbot
  labels:
    app: oves-chatbot
spec:
  replicas: 3
  selector:
    matchLabels:
      app: oves-chatbot
  template:
    metadata:
      labels:
        app: oves-chatbot
    spec:
      containers:
      - name: chatbot
        image: oves-chatbot:latest
        ports:
        - containerPort: 4500
        env:
        - name: NODE_ENV
          value: "production"
        - name: REACT_APP_AZURE_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: chatbot-secrets
              key: azure-client-id
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 4500
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 4500
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: oves-chatbot-service
spec:
  selector:
    app: oves-chatbot
  ports:
  - protocol: TCP
    port: 80
    targetPort: 4500
  type: LoadBalancer
```

Deploy to Kubernetes:

```bash
# Create secrets
kubectl create secret generic chatbot-secrets \
  --from-literal=azure-client-id=your-client-id \
  --from-literal=azure-tenant-id=your-tenant-id

# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

## Production Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] SSL certificates obtained and configured
- [ ] Authentication credentials verified
- [ ] WebSocket server URL updated
- [ ] Build tested locally
- [ ] All tests passing
- [ ] Security headers configured
- [ ] CORS settings configured
- [ ] Rate limiting implemented
- [ ] Error tracking configured (e.g., Sentry)

### Security

- [ ] HTTPS enabled
- [ ] Security headers set (CSP, X-Frame-Options, etc.)
- [ ] Secrets stored securely (not in code)
- [ ] Authentication tokens encrypted
- [ ] Input validation implemented
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Dependencies updated and scanned for vulnerabilities

### Performance

- [ ] Production build optimized
- [ ] Gzip compression enabled
- [ ] CDN configured (optional)
- [ ] Caching headers set
- [ ] Bundle size optimized
- [ ] Lazy loading implemented
- [ ] Images optimized
- [ ] Service worker configured (optional)

### Monitoring

- [ ] Application logging configured
- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Alerts configured
- [ ] Analytics integrated

## Monitoring and Maintenance

### Health Checks

Add health check endpoint in `server.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Logging

Configure PM2 logging:

```json
{
  "apps": [{
    "name": "oves-chatbot",
    "script": "server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "error_file": "/var/log/oves-chatbot/error.log",
    "out_file": "/var/log/oves-chatbot/out.log",
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
    "merge_logs": true
  }]
}
```

### Monitoring Tools

- **Application Performance**: New Relic, Datadog, AppDynamics
- **Error Tracking**: Sentry, Rollbar, Bugsnag
- **Uptime Monitoring**: Pingdom, UptimeRobot, StatusCake
- **Log Management**: ELK Stack, Splunk, Loggly

### Backup Strategy

1. **Code**: Git repository (GitHub, GitLab, Bitbucket)
2. **Configuration**: Encrypted backup of environment variables
3. **Database**: Regular automated backups (if applicable)
4. **Docker Images**: Store in container registry

### Update Process

1. **Test updates in staging environment**
2. **Create backup of current deployment**
3. **Deploy new version**
4. **Run smoke tests**
5. **Monitor for errors**
6. **Rollback if issues detected**

## Troubleshooting

### Common Issues

#### 1. Build Fails

**Problem**: `npm run build` fails

**Solutions**:

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check Node version
node --version  # Should be 18.x+

# Increase memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

#### 2. Docker Container Won't Start

**Problem**: Container exits immediately

**Solutions**:

```bash
# Check logs
docker logs oves-chatbot

# Run interactively
docker run -it oves-chatbot sh

# Check port conflicts
netstat -tuln | grep 4500
```

#### 3. WebSocket Connection Fails

**Problem**: WebSocket connection errors

**Solutions**:

- Verify WebSocket URL is correct
- Check firewall rules
- Ensure WSS (secure WebSocket) for HTTPS sites
- Verify CORS settings
- Check proxy configuration

#### 4. Authentication Errors

**Problem**: Azure AD or Google OAuth fails

**Solutions**:

- Verify client ID and tenant ID
- Check redirect URI matches configuration
- Ensure credentials are not expired
- Verify network connectivity to auth providers

#### 5. Performance Issues

**Problem**: Slow load times

**Solutions**:

- Enable gzip compression
- Optimize bundle size
- Use CDN for static assets
- Implement code splitting
- Enable browser caching

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
DEBUG=* npm start

# Docker
docker run -e DEBUG=* oves-chatbot
```

### Getting Help

- Check application logs
- Review error tracking dashboard
- Consult documentation
- Open GitHub issue
- Contact support team

## Rollback Procedure

### Docker Rollback

```bash
# List images
docker images

# Stop current container
docker stop oves-chatbot

# Remove current container
docker rm oves-chatbot

# Run previous version
docker run -d --name oves-chatbot oves-chatbot:previous-tag
```

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/oves-chatbot

# Rollback to previous version
kubectl rollout undo deployment/oves-chatbot

# Rollback to specific revision
kubectl rollout undo deployment/oves-chatbot --to-revision=2
```

### Cloud Platform Rollback

Each platform has its own rollback mechanism:

- **AWS EB**: `eb deploy --version previous-version`
- **GCP Cloud Run**: Revert to previous revision in console
- **Azure App Service**: Swap deployment slots

## Conclusion

This deployment guide covers the most common deployment scenarios. For specific requirements or issues, consult the
platform-specific documentation or contact the development team.

**Remember**: Always test deployments in a staging environment before deploying to production!
