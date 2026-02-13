# Contributing to Bootstrap Angular Schematic

Thank you for your interest in contributing! Here are some guidelines.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/dao/bootstrap-angular-schematic.git
cd bootstrap-angular-schematic
```

2. Install dependencies:
```bash
npm install
```

3. Build the schematic:
```bash
npm run build
```

4. Test locally:
```bash
# In a test Angular project
npm link /path/to/bootstrap-angular-schematic
ng add @daolvera/bootstrap-angular-schematic
```

## Making Changes

1. Create a new branch for your feature or fix
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

- Test the schematic in a fresh Angular project
- Verify all services and components work correctly
- Check responsive design on different screen sizes
- Ensure no console errors

## Pull Request Process

1. Update documentation if needed
2. Update CHANGELOG.md with your changes
3. Ensure the build passes
4. Request review from maintainers

## Questions?

Feel free to open an issue for any questions or concerns.
