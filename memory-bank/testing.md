# Testing Strategy

This project uses [Vitest](https://vitest.dev/) for unit and integration testing, and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro) for rendering components and interacting with them in a user-centric way.

## Key Principles

- **Test user behavior, not implementation details.** Tests should verify that the component behaves as the user would expect, rather than asserting on internal state or implementation details.
- **Mock external dependencies.** Services like the Notion API should be mocked to ensure that tests are fast, reliable, and don't depend on external services.
- **Write specific and meaningful assertions.** Tests should verify that the correct content is rendered to the screen, not just that the component doesn't crash.

## Running Tests

Tests can be run with the following command:

```bash
npm test
```

This will run all tests in the `__tests__` directory.
