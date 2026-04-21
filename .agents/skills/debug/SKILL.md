# Debug Skill

Analyze, diagnose, and resolve issues in code by identifying root causes, suggesting fixes, and explaining the reasoning behind bugs.

## Overview

The `debug` skill helps developers understand what's going wrong in their code. It goes beyond surface-level error messages to trace the root cause, explain why the bug exists, and provide a clear path to resolution.

## When to Use

- Runtime errors or unexpected behavior
- Logic bugs producing wrong output
- Performance regressions
- Intermittent or hard-to-reproduce issues
- Understanding cryptic stack traces
- Diagnosing async/timing issues

## Process

### 1. Gather Context

Before diagnosing, collect:
- The error message or unexpected behavior description
- Relevant code snippet(s)
- Environment details (browser, Node version, OS if relevant)
- Steps to reproduce
- What was expected vs. what actually happened
- Any recent changes that may have triggered the issue

### 2. Identify the Error Class

Categorize the bug to narrow the search:

**Syntax / Parse Errors**
- Typos, missing brackets, invalid tokens
- Usually caught at parse time with clear line numbers

**Reference Errors**
- Accessing undefined variables or properties
- Scope issues, hoisting surprises

**Type Errors**
- Calling non-functions, accessing props on null/undefined
- Implicit type coercion producing unexpected results

**Logic Errors**
- Code runs without throwing but produces wrong output
- Off-by-one errors, incorrect conditionals, wrong operator

**Async / Timing Errors**
- Race conditions, unhandled promise rejections
- Callback ordering assumptions, stale closures

**Integration Errors**
- Mismatched API contracts, wrong data shapes
- Environment-specific behavior differences

### 3. Trace the Execution Path

- Follow the call stack from the error site backward
- Identify where state first diverges from expectation
- Look for the last point where data was in a known-good state
- Check all code paths that could lead to the error site

### 4. Form a Hypothesis

State a clear, testable hypothesis:
> "I believe the bug occurs because `X` happens before `Y` is initialized, causing `Z` to be undefined when accessed."

A good hypothesis:
- Is specific and falsifiable
- Points to a single root cause
- Explains both the symptom and the mechanism

### 5. Propose a Fix

Provide the minimal change that resolves the root cause:
- Avoid over-engineering the fix
- Prefer defensive code only where the edge case is genuinely unexpected
- If multiple valid fixes exist, explain the trade-offs

### 6. Explain the Prevention

After fixing, briefly note:
- Why this bug was easy to introduce
- What pattern or practice would prevent recurrence
- Whether a test should be added to catch regression

## Output Format

```
### Diagnosis
[Clear statement of what the bug is and why it occurs]

### Root Cause
[The specific line(s) or condition responsible]

### Fix
[Code change with explanation]

### Prevention
[Pattern or practice to avoid recurrence]
```

## Common JavaScript Pitfalls

**Async/Await without try/catch**
Unhandled rejections silently swallow errors. Always wrap `await` in try/catch or attach `.catch()`.

**Mutating shared state**
Arrays and objects passed as arguments are passed by reference. Mutations inside functions affect the caller's data unexpectedly.

**`this` context loss**
Arrow functions capture `this` lexically; regular functions do not. Passing a method as a callback often loses its `this` binding.

**Closure over loop variable**
Using `var` in a loop and referencing the variable in a closure captures the final value, not the per-iteration value. Use `let` or an IIFE.

**Equality with `==`**
Loose equality performs type coercion. Prefer `===` unless coercion is explicitly intended.

**`NaN` comparisons**
`NaN !== NaN`. Use `Number.isNaN()` to check for NaN values.

## Debugging Checklist

- [ ] Read the full error message and stack trace carefully
- [ ] Reproduce the issue in isolation (minimal repro)
- [ ] Check recent git changes for the likely culprit
- [ ] Add logging/breakpoints at the earliest suspect point
- [ ] Verify assumptions about data shapes and types
- [ ] Check for async ordering issues
- [ ] Search for similar issues in the codebase or known libraries
- [ ] Test the fix against the original repro case
- [ ] Consider edge cases the fix might introduce
