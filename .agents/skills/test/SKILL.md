# Skill: Test

Generate unit and integration tests for JavaScript/TypeScript code with appropriate coverage, edge cases, and clear assertions.

## Trigger

Use this skill when asked to:
- Write tests for existing code
- Add test coverage to a module
- Generate test cases for a function or class
- Create test suites for components or utilities

## Behavior

### Test Framework Detection

Infer the test framework from the project context:
- Check `package.json` for `jest`, `vitest`, `mocha`, `jasmine`, `ava`
- Check for config files: `jest.config.*`, `vitest.config.*`, `.mocharc.*`
- Default to **Jest** if no framework is detected

### File Naming Conventions

Follow the project's existing convention:
- `*.test.ts` / `*.test.js` — co-located with source
- `*.spec.ts` / `*.spec.js` — co-located with source
- `__tests__/*.ts` — dedicated test directory

If no convention is established, prefer `*.test.ts` co-located with the source file.

### Test Structure

Organize tests using the **Arrange / Act / Assert** pattern:

```js
it('should return the formatted name', () => {
  // Arrange
  const input = { first: 'Jane', last: 'Doe' };

  // Act
  const result = formatName(input);

  // Assert
  expect(result).toBe('Jane Doe');
});
```

Group related tests with `describe` blocks:

```js
describe('formatName', () => {
  describe('when both names are provided', () => {
    it('returns first and last name separated by a space', () => { ... });
  });

  describe('when only first name is provided', () => {
    it('returns just the first name', () => { ... });
  });
});
```

### Coverage Targets

For each function or module tested, generate cases covering:

1. **Happy path** — expected input, expected output
2. **Edge cases** — empty strings, zero, null, undefined, empty arrays
3. **Boundary conditions** — min/max values, single-item arrays
4. **Error cases** — invalid input, thrown errors, rejected promises
5. **Side effects** — mock calls, state mutations, event emissions

### Mocking

Use the framework's native mocking utilities:

```js
// Jest / Vitest
const fetchData = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
const logger = { warn: jest.fn(), error: jest.fn() };

afterEach(() => {
  jest.clearAllMocks();
});
```

Prefer **dependency injection** over module-level mocking when the source code supports it. Only use `jest.mock()` / `vi.mock()` for external modules (network, filesystem, third-party libs).

### Async Tests

Always `await` async operations; never leave floating promises:

```js
it('resolves with user data', async () => {
  const result = await getUser(42);
  expect(result.id).toBe(42);
});

it('rejects when user is not found', async () => {
  await expect(getUser(-1)).rejects.toThrow('User not found');
});
```

### Snapshot Tests

Use snapshots sparingly — only for stable, serializable output (e.g., rendered HTML, formatted strings). Avoid snapshots for objects that change frequently.

```js
it('renders the button correctly', () => {
  const html = renderButton({ label: 'Submit', disabled: false });
  expect(html).toMatchSnapshot();
});
```

## Output Format

Produce a complete test file with:
- Necessary imports at the top
- A root `describe` block named after the module
- Individual `describe` blocks per function/method
- Clear, descriptive `it`/`test` labels in plain English
- No commented-out placeholder tests

## Examples

### Input — utility function

```ts
// src/utils/truncate.ts
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
```

### Output

```ts
// src/utils/truncate.test.ts
import { truncate } from './truncate';

describe('truncate', () => {
  it('returns the original string when shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string when equal to maxLength', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and appends ellipsis when longer than maxLength', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('handles an empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('handles maxLength of zero', () => {
    expect(truncate('hello', 0)).toBe('...');
  });
});
```

## Anti-Patterns to Avoid

- **Testing implementation details** — test behavior, not internal variable names or private methods
- **Overly broad mocks** — mock only what is necessary; let real logic run when safe
- **Duplicate assertions** — one logical assertion per test keeps failures easy to diagnose
- **Magic numbers** — use named constants or inline comments to explain non-obvious values
- **Shared mutable state** — reset mocks and state in `beforeEach` / `afterEach`
