// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/ui/alert.tsx — A coloured message box: red for errors, green for success.
//
// CONCEPT — "component": a function that returns a piece of screen (markup).
//   You use it like an HTML tag: <Alert tone="success">Saved!</Alert>.
// CONCEPT — "props": the inputs of a component (here `tone` and `children`).
//   `children` = whatever is written between the opening and closing tag.
// CONCEPT — JSX: the HTML-looking code inside the return(...). {curly braces}
//   put a JavaScript value inside it.
// ─────────────────────────────────────────────────────────────────────────────

// The colours of each kind of message (Tailwind classes, see styles.ts).
const tones = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

// tone = which colour (default 'error'); children = the message text.
export function Alert({ tone = 'error', children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    // role="alert" makes screen readers read errors out loud; "status" for calmer messages.
    <p role={tone === 'error' ? 'alert' : 'status'} className={`rounded-lg border p-3 text-sm ${tones[tone]}`}>
      {children}
    </p>
  );
}
