// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/ui/styles.ts — Tailwind class strings used by many components,
// defined ONCE here.
//
// CONCEPT — Tailwind CSS: instead of writing CSS files, we put small ready-made
//   class names on elements. Each name does one thing:
//   "rounded-lg" = rounded corners, "px-4" = padding left/right, "bg-brand-600" =
//   background colour, "hover:..." = only while the mouse is over it,
//   "focus:..." = only while the input is selected, "sm:..." = only on wider screens.
// ─────────────────────────────────────────────────────────────────────────────

// Text boxes: height 11, rounded, grey border, white background; blue ring when selected.
export const inputClass =
  'h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100';
// Labels: stacked (text above its input), small bold grey text.
export const labelClass = 'flex flex-col gap-1 text-sm font-medium text-slate-700';

// What every button shares: size, rounded corners, a faded look when disabled.
const buttonBase =
  'inline-flex h-11 items-center justify-center rounded-lg px-4 font-medium transition disabled:cursor-not-allowed disabled:opacity-60';
// The 4 button looks. Usage: className={buttonClass.primary}
export const buttonClass = {
  primary: `${buttonBase} bg-brand-600 text-white hover:bg-brand-700`, // main action (blue)
  secondary: `${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100`, // outlined
  danger: `${buttonBase} bg-red-600 text-white hover:bg-red-700`, // destructive (red)
  ghost: `${buttonBase} text-slate-700 hover:bg-brand-50 hover:text-brand-700`, // no border/background
};
// ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' (the keys of buttonClass).
export type ButtonVariant = keyof typeof buttonClass;

// A white box with border, rounded corners and a soft shadow.
export const cardClass = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';
// A blue text link, underlined on hover.
export const linkClass = 'font-medium text-brand-600 hover:underline';
// Grey "less important" text.
export const mutedClass = 'text-slate-500';

// Tables (admin lists, order lists, order items)
export const tableClass = 'w-full border-collapse text-left text-sm'; // the whole table
export const thClass = 'border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700'; // header cell
export const tdClass = 'border-b border-slate-100 px-4 py-3 text-slate-700'; // normal cell
