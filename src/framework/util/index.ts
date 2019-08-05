export * from './stack.js';

// performance.now() is available in all browsers, but not in scope by default in Node.
// tslint:disable-next-line no-var-requires
const perf = typeof performance !== 'undefined' ? performance : require('perf_hooks').performance;

export function now(): number {
  return perf.now();
}

export function objectEquals(x: unknown, y: unknown): boolean {
  if (typeof x !== 'object' || typeof y !== 'object') return x === y;
  if (x === null || y === null) return x === y;
  if (x.constructor !== y.constructor) return false;
  if (x instanceof Function) return x === y;
  if (x instanceof RegExp) return x === y;
  if (x === y || x.valueOf() === y.valueOf()) return true;
  if (Array.isArray(x) && Array.isArray(y) && x.length !== y.length) return false;
  if (x instanceof Date) return false;
  if (!(x instanceof Object)) return false;
  if (!(y instanceof Object)) return false;

  const x1 = x as { [k: string]: unknown };
  const y1 = y as { [k: string]: unknown };
  const p = Object.keys(x);
  return Object.keys(y).every(i => p.indexOf(i) !== -1) && p.every(i => objectEquals(x1[i], y1[i]));
}
