# Optimize Skill

Improves performance, reduces bundle size, and eliminates unnecessary re-renders or computations in JavaScript/TypeScript code.

## When to Use

- Code feels slow or unresponsive
- Bundle size is too large
- Unnecessary re-renders are occurring in React components
- Expensive computations are running too frequently
- Memory usage is higher than expected

## Approach

### 1. Profile First

Never optimize blindly. Identify the actual bottleneck:

```js
// Use console.time to measure
console.time('operation');
expensiveOperation();
console.timeEnd('operation');

// Use performance.mark for more precision
performance.mark('start');
expensiveOperation();
performance.mark('end');
performance.measure('operation', 'start', 'end');
```

### 2. Memoization

Cache results of expensive pure functions:

```js
/**
 * Memoizes a function, caching results by serialized arguments.
 * Only use for pure functions with serializable arguments.
 *
 * @param {Function} fn - The function to memoize
 * @returns {Function} Memoized version of fn
 */
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example usage
const expensiveCalc = memoize((n) => {
  // simulate heavy computation
  return Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
});
```

### 3. Debounce & Throttle

Limit how often event handlers fire:

```js
/**
 * Debounces a function — delays execution until after `wait` ms
 * have passed since the last invocation.
 *
 * @param {Function} fn
 * @param {number} wait - milliseconds
 * @returns {Function}
 */
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Throttles a function — ensures it fires at most once per `limit` ms.
 *
 * @param {Function} fn
 * @param {number} limit - milliseconds
 * @returns {Function}
 */
function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}
```

### 4. Lazy Loading

Defer loading of non-critical resources:

```js
// Dynamic import for code splitting
async function loadHeavyModule() {
  const { default: heavyLib } = await import('./heavyLib.js');
  return heavyLib;
}

// Lazy initialize expensive objects
class LazyService {
  get client() {
    if (!this._client) {
      this._client = createExpensiveClient();
    }
    return this._client;
  }
}
```

### 5. Avoid Common Pitfalls

```js
// BAD: creates new array on every call
const filtered = items.filter(Boolean).map(transform).slice(0, 10);

// BETTER: early exit, single pass when possible
const filtered = [];
for (const item of items) {
  if (!item) continue;
  filtered.push(transform(item));
  if (filtered.length === 10) break;
}

// BAD: repeated DOM queries
for (let i = 0; i < 1000; i++) {
  document.getElementById('counter').textContent = i;
}

// BETTER: cache the reference
const counter = document.getElementById('counter');
for (let i = 0; i < 1000; i++) {
  counter.textContent = i;
}
```

## Checklist

- [ ] Profiled before optimizing — know where the bottleneck is
- [ ] Memoized pure functions called repeatedly with same args
- [ ] Debounced or throttled high-frequency event handlers
- [ ] Lazy-loaded non-critical modules or resources
- [ ] Avoided unnecessary array/object allocations in hot paths
- [ ] Cached DOM references and expensive lookups
- [ ] Verified optimization actually improved measurable performance
- [ ] Did not sacrifice readability without significant gain

## Anti-patterns to Avoid

- **Premature optimization** — always measure first
- **Over-memoizing** — caching has memory cost; only memoize truly expensive ops
- **Micro-optimizations** — e.g. `i|0` instead of `Math.floor` — rarely worth it
- **Breaking correctness for speed** — a fast wrong answer is worse than a slow right one
