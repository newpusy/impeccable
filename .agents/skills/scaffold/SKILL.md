# Scaffold Skill

Generate boilerplate code structures, file templates, and project scaffolding based on patterns and conventions detected in the existing codebase.

## Overview

The `scaffold` skill analyzes existing code patterns and generates consistent, ready-to-use boilerplate for new components, modules, tests, or entire feature slices.

## Usage

```
skill: scaffold
target: <what to scaffold>
context: <optional context or constraints>
```

## Capabilities

### Component Scaffolding
Generates new components matching the style, naming conventions, and structure of existing components in the project.

**Input:** Component name + type (functional, class, HOC, etc.)
**Output:** Complete component file(s) with:
- Proper imports
- TypeScript types/interfaces (if project uses TS)
- Default props or prop validation
- Basic structure matching existing patterns
- Corresponding test file stub

### Module Scaffolding
Creates new modules with consistent exports, index files, and internal structure.

**Input:** Module name + purpose
**Output:**
- Main module file
- Index file with proper exports
- Types file (if applicable)
- README stub

### Test Scaffolding
Generates test files for existing untested code.

**Input:** Source file path
**Output:** Test file with:
- Describe blocks matching exported functions/classes
- It blocks for common cases (happy path, edge cases, error cases)
- Proper mocks for dependencies
- Import statements

### Feature Slice Scaffolding
For larger features, generates a complete directory structure.

**Input:** Feature name + rough description
**Output:** Directory with:
- Component(s)
- Hooks (if React project)
- Utils
- Types
- Tests
- Index file

## Pattern Detection

Before generating, the skill scans the project for:

1. **Naming conventions** — camelCase, PascalCase, kebab-case for files/exports
2. **Import style** — named vs default exports, import ordering
3. **File organization** — flat vs nested, co-located tests vs separate test dir
4. **Comment style** — JSDoc, inline comments, section headers
5. **Code style** — semicolons, quotes, trailing commas (inferred from existing files)
6. **Framework patterns** — React hooks, Express middleware, etc.

## Process

```
1. Detect project conventions from existing files
2. Identify the closest existing example to use as template
3. Generate scaffold with detected patterns applied
4. Validate generated code is syntactically correct
5. Output with explanation of what was generated and why
```

## Examples

### Example 1: Scaffold a new skill

**Prompt:**
```
skill: scaffold
target: new skill called "optimize"
context: should follow the same structure as existing skills in .agents/skills/
```

**Output:**
```markdown
# Optimize Skill

[Generated SKILL.md following detected pattern from existing skill files]
```

### Example 2: Scaffold a utility module

**Prompt:**
```
skill: scaffold
target: utility module for string formatting
context: project uses ES modules, no TypeScript
```

**Output:**
```javascript
// utils/stringFormat.js
// Generated scaffold — fill in implementations

/**
 * Truncate a string to a maximum length, appending ellipsis if needed.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(str, maxLength) {
  // TODO: implement
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  // TODO: implement
}
```

## Output Format

Always include:
- The generated file(s) with full content
- A brief explanation of pattern decisions made
- Any assumptions noted clearly
- TODOs marked where implementation is needed vs where boilerplate is complete

## Constraints

- Do not overwrite existing files without explicit confirmation
- Generated code must be syntactically valid
- Match the detected code style — don't introduce new conventions
- If no existing pattern is found, default to widely accepted community conventions for the detected framework/language
- Keep scaffolds minimal — include only what's needed, avoid over-engineering

## Related Skills

- `refactor` — restructure existing code
- `audit` — check existing code quality
- `adapt` — modify existing code to fit new requirements
