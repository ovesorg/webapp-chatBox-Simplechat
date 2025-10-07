# Contributing to OVES ChatBot

Thank you for your interest in contributing to the OVES ChatBot project! This document provides guidelines and
instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Prioritize the project's best interests
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Any unprofessional conduct

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** or **pnpm** package manager
- **Git** for version control
- A code editor (VS Code recommended)
- Basic knowledge of React and JavaScript

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/webapp-chatBox-Simplechat.git
   cd webapp-chatBox-Simplechat
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ovesorg/webapp-chatBox-Simplechat.git
   ```

3. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Start development server**
   ```bash
   npm start
   ```

### Recommended VS Code Extensions

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **ES7+ React/Redux/React-Native snippets**: React snippets
- **Auto Rename Tag**: HTML/JSX tag renaming
- **GitLens**: Git integration

## Development Workflow

### 1. Sync with Upstream

Before starting work, sync your fork:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Create Feature Branch

```bash
git checkout -b feature/feature-name
# or
git checkout -b bugfix/bug-description
# or
git checkout -b docs/documentation-update
```

Branch naming conventions:

- `feature/`: New features
- `bugfix/`: Bug fixes
- `docs/`: Documentation updates
- `refactor/`: Code refactoring
- `test/`: Test additions or modifications

### 3. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run tests
npm test

# Build for production
npm run build

# Test the build locally
npm install -g serve
serve -s build
```

### 5. Commit Changes

```bash
git add .
git commit -m "type: descriptive commit message"
```

See [Commit Guidelines](#commit-guidelines) for details.

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Wait for review

## Coding Standards

### JavaScript/React Style Guide

#### 1. Component Structure

```javascript
// Imports
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

// Component
function ComponentName({prop1, prop2}) {
    // State declarations
    const [state, setState] = useState(initialValue);

    // Effects
    useEffect(() => {
        // Effect logic
    }, [dependencies]);

    // Event handlers
    const handleEvent = () => {
        // Handler logic
    };

    // Render
    return (
        <div className="component-name">
            {/* JSX */}
        </div>
    );
}

// PropTypes
ComponentName.propTypes = {
    prop1: PropTypes.string.isRequired,
    prop2: PropTypes.number
};

// Default props
ComponentName.defaultProps = {
    prop2: 0
};

export default ComponentName;
```

#### 2. Naming Conventions

- **Components**: PascalCase (`ChatBot`, `MessageBox`)
- **Functions**: camelCase (`handleClick`, `sendMessage`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_MESSAGE_LENGTH`)
- **Files**: Match component name (`ChatBot.js`, `chatbot.css`)

#### 3. Code Formatting

- **Indentation**: 2 or 4 spaces (consistent with project)
- **Quotes**: Single quotes for JavaScript, double for JSX attributes
- **Semicolons**: Use consistently
- **Line length**: Max 100 characters

#### 4. React Best Practices

```javascript
// ✅ Good: Destructure props
function Component({name, age}) {
    return <div>{name} is {age}</div>;
}

// ❌ Bad: Use props object
function Component(props) {
    return <div>{props.name} is {props.age}</div>;
}

// ✅ Good: Use functional components with hooks
const [count, setCount] = useState(0);

// ❌ Bad: Avoid class components unless necessary
class Component extends React.Component {
}

// ✅ Good: Meaningful state names
const [isLoading, setIsLoading] = useState(false);

// ❌ Bad: Unclear state names
const [flag, setFlag] = useState(false);
```

#### 5. Error Handling

```javascript
// Always handle errors
try {
    await someAsyncOperation();
} catch (error) {
    console.error('Operation failed:', error);
    // Show user-friendly error message
    showNotification('Something went wrong. Please try again.', 'error');
}
```

### CSS Style Guide

#### 1. Class Naming (BEM Convention)

```css
/* Block */
.chat-bot {
}

/* Element */
.chat-bot__message {
}

/* Modifier */
.chat-bot__message--sent {
}
```

#### 2. Organization

```css
/* Layout */
.component {
    display: flex;
    position: relative;
}

/* Box model */
.component {
    width: 100%;
    padding: 1rem;
    margin: 0 auto;
}

/* Typography */
.component {
    font-size: 1rem;
    color: #333;
}

/* Visual */
.component {
    background-color: #fff;
    border: 1px solid #ddd;
}

/* Animation */
.component {
    transition: all 0.3s ease;
}
```

#### 3. Responsive Design

```css
/* Mobile first */
.component {
    width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
    .component {
        width: 50%;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .component {
        width: 33.33%;
    }
}
```

## Testing Guidelines

### Unit Tests

```javascript
import {render, screen, fireEvent} from '@testing-library/react';
import ChatBot from './chatbot';

describe('ChatBot', () => {
    test('renders chat interface', () => {
        render(<ChatBot/>);
        expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    test('sends message on button click', () => {
        render(<ChatBot/>);
        const input = screen.getByPlaceholderText('Type a message...');
        const button = screen.getByText('Send');

        fireEvent.change(input, {target: {value: 'Hello'}});
        fireEvent.click(button);

        expect(screen.getByText('Hello')).toBeInTheDocument();
    });
});
```

### Integration Tests

```javascript
test('complete chat flow', async () => {
    render(<ChatBot/>);

    // Send message
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, {target: {value: 'Test message'}});
    fireEvent.click(screen.getByText('Send'));

    // Wait for response
    await screen.findByText(/bot response/i);

    // Verify message displayed
    expect(screen.getByText('Test message')).toBeInTheDocument();
});
```

### Test Coverage

Aim for:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Run coverage report:

```bash
npm test -- --coverage
```

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(chat): add emoji picker to message input"

# Bug fix
git commit -m "fix(websocket): resolve connection timeout issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(auth): simplify authentication logic"

# Breaking change
git commit -m "feat(api): change WebSocket message format

BREAKING CHANGE: Message format now requires 'type' field"
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject line with period
- Separate subject from body with blank line
- Wrap body at 72 characters
- Explain what and why, not how

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Commits follow commit guidelines
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How has this been tested?

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: PR approved by maintainer
5. **Merge**: PR merged to main branch

### After Merge

- Delete your feature branch
- Update your local main branch
- Close related issues

## Project Structure

### Directory Organization

```
src/
├── components/       # Reusable components
│   └── Emoji.jsx
├── pages/           # Page components
│   ├── Authentication.jsx
│   └── authConfig.js
├── utils/           # Utility functions (add as needed)
├── hooks/           # Custom React hooks (add as needed)
├── services/        # API services (add as needed)
├── constants/       # Constants and config (add as needed)
├── App.js           # Main app component
├── chatbot.js       # Core chatbot logic
└── index.js         # Entry point
```

### Adding New Files

- **Components**: `src/components/ComponentName.jsx`
- **Pages**: `src/pages/PageName.jsx`
- **Utilities**: `src/utils/utilityName.js`
- **Hooks**: `src/hooks/useHookName.js`
- **Services**: `src/services/serviceName.js`

## Common Tasks

### Adding a New Component

1. Create component file in appropriate directory
2. Write component code following style guide
3. Add PropTypes validation
4. Create corresponding CSS file
5. Write unit tests
6. Export component
7. Import and use in parent component

### Adding a New Feature

1. Create feature branch
2. Implement feature
3. Add tests
4. Update documentation
5. Submit PR

### Fixing a Bug

1. Create bugfix branch
2. Write failing test (if possible)
3. Fix the bug
4. Verify test passes
5. Submit PR with issue reference

## Getting Help

### Resources

- **Documentation**: Check `/docs` directory
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions

### Contact

- **Email**: dev@oves.org (example)
- **Slack**: #oves-chatbot (if applicable)
- **GitHub**: Open an issue for bugs or feature requests

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Omnivoltaic Assist ChatBot! 🎉
