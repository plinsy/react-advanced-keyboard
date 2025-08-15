# Contributing to React Advanced Keyboard

Thank you for your interest in contributing to React Advanced Keyboard! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/react-advanced-keyboard.git
   cd react-advanced-keyboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Project Structure

```
src/
├── components/         # React components
│   ├── Keyboard.tsx   # Main keyboard component
│   ├── Key.tsx        # Individual key component
│   └── ...
├── hooks/             # Custom React hooks
├── layouts.ts         # Keyboard layout definitions
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
└── styles.css         # Component styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎯 Types of Contributions

### 🐛 Bug Reports

Before creating a bug report:
1. Check if the issue already exists
2. Use the latest version
3. Provide a minimal reproduction case

Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

### ✨ Feature Requests

For new features:
1. Check if it's already requested
2. Explain the use case
3. Provide examples or mockups
4. Consider the scope and complexity

### 📝 Code Contributions

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Test your changes:
   ```bash
   npm run dev
   # Test in browser at http://localhost:5175
   ```

4. Commit with descriptive messages:
   ```bash
   git commit -m "feat: add DVORAK keyboard layout support"
   ```

5. Push and create a pull request

## 📋 Coding Standards

### TypeScript

- Use strict TypeScript settings
- Define proper interfaces for all props
- Avoid `any` types
- Use meaningful variable names

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop destructuring
- Implement proper error boundaries where needed

### Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use semantic color names
- Maintain accessibility standards

### File Organization

- One component per file
- Use PascalCase for component files
- Use camelCase for utility files
- Group related functionality

## 🎨 Adding New Keyboard Layouts

To add a new keyboard layout:

1. Define the layout in `src/layouts.ts`:
   ```tsx
   export const myCustomLayout: KeyboardLayout = {
     name: 'My Custom Layout',
     type: 'custom',
     platform: 'universal',
     rows: [
       [
         { key: 'q', type: 'letter' },
         { key: 'w', type: 'letter' },
         // ... more keys
       ],
       // ... more rows
     ],
   };
   ```

2. Add it to the available layouts export

3. Update the KeyboardConfig type if needed

4. Add proper documentation

5. Test thoroughly with different configurations

## 🧪 Testing Guidelines

### Manual Testing

1. Test all keyboard layouts
2. Verify autocomplete functionality
3. Check theme switching
4. Test on different screen sizes
5. Verify accessibility features

### Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### Platform Testing

- Windows
- macOS
- Linux
- iOS Safari
- Android Chrome

## 📚 Documentation

When contributing:

1. Update README.md if needed
2. Add JSDoc comments to functions
3. Update type definitions
4. Include usage examples
5. Document breaking changes

## 🚦 Pull Request Process

1. Ensure your PR addresses a single concern
2. Include tests if applicable
3. Update documentation
4. Use descriptive PR titles
5. Reference related issues

### PR Title Format

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: formatting changes`
- `refactor: code improvements`
- `test: add tests`

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow our community guidelines

## 📞 Getting Help

- Open an issue for questions
- Join our discussions
- Check existing documentation
- Review similar PRs

## 🏷️ Release Process

1. Features go to `develop` branch
2. Bug fixes can go to `main` or `develop`
3. Releases are tagged from `main`
4. Follow semantic versioning

Thank you for contributing to React Advanced Keyboard! 🎉
