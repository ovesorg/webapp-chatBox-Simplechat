# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Omnivoltaic Assist ChatBot seriously. If you believe you have found a security vulnerability,
please report it to us as described below.

### Where to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@omnivoltaic.com**

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., XSS, CSRF, authentication bypass)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** (what an attacker could do)
- **Suggested fix** (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
    - Critical: 1-7 days
    - High: 7-30 days
    - Medium: 30-90 days
    - Low: Best effort

### Disclosure Policy

- We will confirm receipt of your vulnerability report
- We will provide an estimated timeline for a fix
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a fix is released
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

### For Developers

#### 1. Authentication & Authorization

```javascript
// ✅ Good: Validate tokens
const validateToken = async (token) => {
  try {
    const response = await instance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    // Handle invalid token
    return null;
  }
};

// ❌ Bad: Trust client-side data
const isAuthenticated = localStorage.getItem('isAuth') === 'true';
```

#### 2. Input Validation

```javascript
// ✅ Good: Validate and sanitize input
const sanitizeMessage = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input');
  }
  return text.trim().slice(0, 1000); // Limit length
};

// ❌ Bad: Use raw input
ws.send(userInput);
```

#### 3. XSS Prevention

```javascript
// ✅ Good: React automatically escapes
return <div>{userMessage}</div>;

// ❌ Bad: Using dangerouslySetInnerHTML without sanitization
return <div dangerouslySetInnerHTML={{ __html: userMessage }} />;

// ✅ Acceptable: With sanitization
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userMessage);
return <div dangerouslySetInnerHTML={{ __html: clean }} />;
```

#### 4. Secure Communication

```javascript
// ✅ Good: Use WSS for production
const wsUrl = window.location.protocol === 'https:' 
  ? 'wss://api.example.com' 
  : 'ws://localhost:8080';

// ❌ Bad: Hardcode insecure protocol
const ws = new WebSocket('ws://api.example.com');
```

#### 5. Secret Management

```javascript
// ✅ Good: Use environment variables
const clientId = process.env.REACT_APP_AZURE_CLIENT_ID;

// ❌ Bad: Hardcode secrets
const clientId = 'abc123-secret-id';
```

#### 6. CORS Configuration

```javascript
// Backend: Configure CORS properly
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### For Deployment

#### 1. Environment Variables

Never commit sensitive data:

```bash
# ✅ Good: Use .env files (gitignored)
REACT_APP_AZURE_CLIENT_ID=your-client-id

# ❌ Bad: Hardcode in source
const clientId = "abc123-secret-id";
```

#### 2. HTTPS/WSS

Always use secure protocols in production:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

#### 3. Security Headers

Configure security headers in Nginx:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

#### 4. Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### 5. Dependency Security

Regularly update dependencies:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force
```

## Known Security Considerations

### 1. Client-Side Storage

**Risk**: Data in localStorage is accessible to JavaScript
**Mitigation**:

- Only store non-sensitive data (UUID)
- Never store tokens or passwords
- Use httpOnly cookies for sensitive data (backend implementation)

### 2. WebSocket Security

**Risk**: WebSocket connections can be intercepted
**Mitigation**:

- Always use WSS (WebSocket Secure) in production
- Implement authentication for WebSocket connections
- Validate all incoming messages
- Implement rate limiting

### 3. Authentication Tokens

**Risk**: Token theft or misuse
**Mitigation**:

- Use short-lived tokens
- Implement token refresh
- Store tokens securely
- Validate tokens on every request

### 4. Cross-Site Scripting (XSS)

**Risk**: Malicious scripts injected into the application
**Mitigation**:

- React's automatic escaping
- Sanitize any HTML content
- Use Content Security Policy headers
- Validate and sanitize all user input

### 5. Cross-Site Request Forgery (CSRF)

**Risk**: Unauthorized actions performed on behalf of authenticated users
**Mitigation**:

- Use CSRF tokens for state-changing operations
- Validate origin headers
- Use SameSite cookie attribute

## Security Checklist

### Development

- [ ] No secrets in source code
- [ ] Input validation implemented
- [ ] Output encoding implemented
- [ ] Authentication properly implemented
- [ ] Authorization checks in place
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data

### Deployment

- [ ] HTTPS/WSS enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Dependencies up to date
- [ ] Security audit performed
- [ ] Secrets stored securely (environment variables, secrets manager)
- [ ] Firewall rules configured
- [ ] Monitoring and alerting enabled

### Ongoing

- [ ] Regular dependency updates
- [ ] Regular security audits
- [ ] Monitor security advisories
- [ ] Review access logs
- [ ] Update security documentation

## Security Tools

### Recommended Tools

1. **Dependency Scanning**
    - npm audit
    - Snyk
    - Dependabot

2. **Code Analysis**
    - ESLint with security plugins
    - SonarQube
    - CodeQL

3. **Runtime Protection**
    - Web Application Firewall (WAF)
    - DDoS protection
    - Rate limiting

4. **Monitoring**
    - Sentry (error tracking)
    - LogRocket (session replay)
    - CloudFlare (DDoS protection)

### Running Security Scans

```bash
# NPM audit
npm audit

# Snyk scan
npx snyk test

# ESLint security scan
npm install --save-dev eslint-plugin-security
npx eslint . --ext .js,.jsx
```

## Compliance

### GDPR Considerations

If handling EU user data:

- Implement data minimization
- Provide data export functionality
- Implement data deletion
- Obtain proper consent
- Maintain privacy policy

### Accessibility

Security features should not compromise accessibility:

- Ensure authentication flows are accessible
- Provide alternative authentication methods
- Clear error messages for screen readers

## Incident Response

### In Case of Security Breach

1. **Immediate Actions**
    - Isolate affected systems
    - Preserve evidence
    - Assess scope of breach
    - Notify security team

2. **Investigation**
    - Determine attack vector
    - Identify compromised data
    - Document timeline
    - Analyze logs

3. **Remediation**
    - Patch vulnerabilities
    - Reset credentials
    - Update security measures
    - Deploy fixes

4. **Communication**
    - Notify affected users
    - Report to authorities (if required)
    - Public disclosure (if appropriate)
    - Post-mortem analysis

5. **Prevention**
    - Implement additional safeguards
    - Update security policies
    - Conduct security training
    - Review and improve processes

## Resources

### Security References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React: dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-inner-html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [WebSocket Security (OWASP Cheat Sheet)](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html)

### Security Training

- OWASP WebGoat
- HackTheBox
- TryHackMe
- PortSwigger Web Security Academy

## Contact

For security concerns:

- **Email**: security@omnivoltaic.com
- **PGP Key**: [Add PGP key if available]

For general questions:

- **GitHub Issues**: For non-security bugs
- **Website**: [omnivoltaic.com](https://omnivoltaic.com)

---

**Last Updated**: 2025-10-07

**Version**: 1.0.0
