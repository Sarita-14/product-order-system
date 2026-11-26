'use client';
import { useEffect, useState } from 'react';

// Returns `value`, but only after it has stopped changing for `delay` ms.
// Typing "pencil" fast = 6 changes of `value`, but only 1 change of the result,
// so only 1 API call instead of 6.
export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay); // start waiting
    return () => clearTimeout(timer); // value changed again before the wait ended -> cancel
  }, [value, delay]);

  return debounced;
}