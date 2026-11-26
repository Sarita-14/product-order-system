// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/format.ts — turns raw values into nice text for the screen.
// Display formatting shared by every component (one formatter each, created once).
//
// CONCEPT — Intl: the browser/Node's built-in tool for formatting numbers and
//   dates the way a country writes them. 'en-IN' = English, India.
// ─────────────────────────────────────────────────────────────────────────────

// A money formatter in Indian rupees (₹ sign, Indian comma style).
const rupees = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
// A date formatter: medium date + short time, e.g. "26 Nov 2026, 1:00 pm".
const dates = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

// 1499 -> "₹1,499.00"
export const formatRupees = (amount: number) => rupees.format(amount);

// "2026-11-26T07:30:00.000Z" -> "26 Nov 2026, 1:00 pm"
// new Date(iso) turns the text from the API into a real date first.
export const formatDate = (iso: string) => dates.format(new Date(iso));

// Short, readable order number: "72a7290d-222f-..." -> "#72A7290D"
// slice(0, 8) = the first 8 characters; toUpperCase() = capital letters.
export const formatOrderNumber = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;
