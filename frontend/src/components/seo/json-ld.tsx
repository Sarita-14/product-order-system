// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/seo/json-ld.tsx
// Puts structured data (JSON-LD) in the page for search engines.
// "<" is replaced with a harmless code, so text from the database can never break out of the <script> tag.
// DATA COMES FROM: lib/seo.ts (productJsonLd, breadcrumbJsonLd).
// ─────────────────────────────────────────────────────────────────────────────

// data = any object; it is written into the page as JSON text.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json" // tells Google "this is structured data, not code to run"
      // JSON.stringify = object -> text. replace(/</g, ...) = every "<" becomes a safe code.
      // dangerouslySetInnerHTML = React's scary-sounding way to put raw text inside a tag; it is safe here because we replaced every "<".
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
