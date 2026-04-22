# Skill: Refactor

Refactor existing code to improve structure, readability, and maintainability without changing external behavior.

## When to Use

- Code has grown organically and become hard to follow
- Functions are doing too many things at once
- Repeated logic that should be extracted into helpers
- Variable/function names are unclear or misleading
- Deep nesting making logic hard to trace
- File is too long and should be split

## Process

### 1. Understand Before Changing

Before touching anything:
- Read the full function/module being refactored
- Identify what it actually does (not what it looks like it does)
- Note any side effects, edge cases, or implicit dependencies
- Check if there are tests — if not, consider adding them first

### 2. Identify the Problem

Be specific about what's wrong:

```
// Too vague:
"This code is messy"

// Better:
"processData() does validation, transformation, AND persistence — should be split"
"The `flag` variable is a boolean but controls 4 different behaviors"
"Lines 40-80 are duplicated in utils.js with minor differences"
```

### 3. Refactor in Small Steps

Never refactor everything at once. Pick one issue:

**Extract function:**
```js
// Before
function handleSubmit(form) {
  const name = form.name.trim();
  const email = form.email.toLowerCase().trim();
  if (!name || !email || !email.includes('@')) {
    showError('Invalid input');
    return;
  }
  // ... rest of logic
}

// After
function validateFormInput({ name, email }) {
  if (!name.trim()) return 'Name is required';
  if (!email.trim() || !email.includes('@')) return 'Valid email required';
  return null;
}

function handleSubmit(form) {
  const error = validateFormInput(form);
  if (error) { showError(error); return; }
  // ... rest of logic
}
```

**Rename for clarity:**
```js
// Before
const d = new Date();
const x = users.filter(u => u.active);

// After
const now = new Date();
const activeUsers = users.filter(u => u.active);
```

**Flatten nesting:**
```js
// Before
function process(item) {
  if (item) {
    if (item.valid) {
      if (item.data) {
        return transform(item.data);
      }
    }
  }
  return null;
}

// After
function process(item) {
  if (!item || !item.valid || !item.data) return null;
  return transform(item.data);
}
```

### 4. Preserve Behavior

- Run existing tests after each change
- If no tests exist, manually verify the same inputs produce the same outputs
- Don't sneak in feature changes — refactor is refactor only
- If you spot a bug while refactoring, note it separately — don't fix it inline

### 5. Review the Diff

Before committing, look at the diff:
- Is every change justified?
- Did you accidentally change logic somewhere?
- Are the new names actually clearer?
- Is the file shorter/simpler or just different?

## Common Patterns

### Replace Magic Values
```js
// Before
if (status === 3) { ... }
setTimeout(fn, 86400000);

// After
const STATUS_ARCHIVED = 3;
const ONE_DAY_MS = 86_400_000;

if (status === STATUS_ARCHIVED) { ... }
setTimeout(fn, ONE_DAY_MS);
```

### Consolidate Conditionals
```js
// Before
if (user.role === 'admin') return true;
if (user.role === 'moderator') return true;
if (user.role === 'editor') return true;
return false;

// After
const PRIVILEGED_ROLES = ['admin', 'moderator', 'editor'];
return PRIVILEGED_ROLES.includes(user.role);
```

### Separate Query from Command
```js
// Before — does two things
function getAndClearQueue() {
  const items = [...queue];
  queue = [];
  return items;
}

// After — explicit about the side effect
function flushQueue() {
  const items = [...queue];
  queue = [];
  return items;
}
```

## What NOT to Do

- Don't refactor code you don't understand yet
- Don't refactor and add features in the same commit
- Don't rename things just because you'd name them differently — only rename when the current name is genuinely confusing
- Don't over-abstract — three similar lines don't always need a helper function
- Don't refactor stable, rarely-touched code without a reason

## Output Format

When presenting a refactor:
1. Briefly explain what problem was addressed
2. Show before/after for non-obvious changes
3. Confirm behavior is preserved
4. Note anything that was intentionally left alone
