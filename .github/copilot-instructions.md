# React Advanced Keyboard - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React TypeScript library project for building virtual keyboard components with autocomplete functionality. The project is designed to be published as an npm package following modern best practices.

## Tech Stack
- **Framework**: React 19+ with TypeScript
- **Build Tool**: Vite 7+
- **Styling**: Tailwind CSS with custom keyboard-specific classes
- **Package Manager**: pnpm
- **Utilities**: class-variance-authority (cva) for component variants, clsx for conditional classes

## Architecture Guidelines

### Components Structure
- **Keyboard**: Main component that orchestrates the virtual keyboard
- **Key**: Individual key component with press animations and variants
- **Autocomplete**: Suggestion dropdown component
- **useKeyboard**: Core hook managing keyboard state and logic

### Styling Conventions
- Use Tailwind CSS utility classes
- Custom keyboard styles defined in `@layer components`
- Component variants managed with `class-variance-authority`
- Consistent color scheme using custom Tailwind theme extensions

### TypeScript Best Practices
- Strict type checking enabled
- Use `type` imports for type-only imports
- Comprehensive interface definitions in `types.ts`
- Proper generic types for reusable components

### State Management
- Use React hooks for component state
- Custom `useKeyboard` hook for complex keyboard logic
- Controlled and uncontrolled component patterns supported

### Performance Considerations
- Debounced async suggestion fetching
- Memoized layout filtering
- Efficient re-rendering with proper dependencies

## Code Style
- Use functional components with hooks
- Prefer const assertions and readonly arrays where appropriate
- Use destructuring for props and state
- Consistent naming: camelCase for variables, PascalCase for components
- Export components and types from main index file

## Testing Approach
- Focus on user interactions and keyboard behavior
- Test autocomplete functionality with various input scenarios
- Verify accessibility features and keyboard navigation

When generating code for this project, please follow these conventions and maintain consistency with the existing codebase.
