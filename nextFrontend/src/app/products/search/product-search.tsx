'use client';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

type Product = { id: string; name: string; description: string | null; price: number; stockQuantity: number };

type Result = { search: string; products: Product[]; error?: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export default function ProductSearch() {
  const [search, setSearch] = useState(''); // updates on every keystroke
  const debouncedSearch = useDebounce(search, 500); // updates 500ms after typing stops

  // The last answer, and the search text it belongs to
  const [result, setResult] = useState<Result | null>(null);

  // An answer for another search text means the new one is still on its way
  const loading = result?.search !== debouncedSearch;
  const products = result?.products ?? [];
  const error = loading ? null : result?.error;

  // Runs only when the DEBOUNCED value changes -> one request per pause in typing
  useEffect(() => {
    // AbortController cancels the previous request if a newer search starts,
    // so a slow old response can't overwrite newer results.
    const controller = new AbortController();

    const query = debouncedSearch.trim()
      ? `?search=${encodeURIComponent(debouncedSearch.trim())}` // encode spaces, &, % ...
      : '';

    fetch(`${API_URL}/products${query}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((payload) => {
        if (!payload.success) throw new Error(payload.message);
        setResult({ search: debouncedSearch, products: payload.data });
      })
      .catch((e: Error) => {
        if (e.name === 'AbortError') return; // we cancelled it ourselves: not an error
        setResult({
          search: debouncedSearch,
          products: [],
          error: 'Could not load products. Is the API running?',
        });
      });

    return () => controller.abort(); // cleanup = cancel when the search changes again
  }, [debouncedSearch]);

  const isTyping = search !== debouncedSearch;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', display: 'grid', gap: 16 }}>
      <input
        type="search"
        placeholder="Search products by name or description…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      <small style={{ opacity: 0.7 }}>
        {isTyping ? 'Typing…' : loading ? 'Searching…' : `${products.length} result(s)`}
      </small>

      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products match “{debouncedSearch}”.</p>
      )}

      <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
        {products.map((p) => (
          <li key={p.id} style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
            <strong>{p.name}</strong> — ₹{p.price} · {p.stockQuantity} in stock
            {p.description && <div style={{ opacity: 0.7 }}>{p.description}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}