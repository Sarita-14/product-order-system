// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/layout.tsx — the ROOT layout: the frame around EVERY page.
//
// CONCEPT — App Router: in Next.js, folders inside app/ become URLs.
//   app/(public)/login/page.tsx -> /login.   A "layout.tsx" wraps every page
//   in its folder and below. This one is at the top, so it wraps the whole site.
//
// CONCEPT — Server Component: by default every component here runs ON THE
//   SERVER and sends finished HTML to the browser (good for speed and SEO).
// ─────────────────────────────────────────────────────────────────────────────

// The top bar and the bottom bar.
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
// The site's name and full address.
import { SITE_NAME, SITE_URL } from '@/lib/seo';
// Types for the metadata and viewport objects.
import type { Metadata, Viewport } from 'next';
// ReactNode = anything that can be shown.
import type { ReactNode } from 'react';
// Load the global styles (Tailwind + our colours) once, for the whole site.
import './globals.css';

// Site-wide SEO defaults. Each page adds its own through buildMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // turns "/products/1" into a full URL for canonical (the page's official address) / Open Graph
  title: {
    default: SITE_NAME, // used when a page gives no title
    template: `%s | ${SITE_NAME}`, // "%s" is replaced by the page's title: "Login | Product Order System"
  },
  description: 'Browse products and order online.', // used when a page gives no description of its own
  applicationName: SITE_NAME,
};

// Viewport = how the page fits on phones (SEO check: "lang + viewport").
export const viewport: Viewport = {
  width: 'device-width', // as wide as the phone's screen
  initialScale: 1, // no zoom at start
  themeColor: '#4f46e5', // colour of the phone's browser bar (our brand blue)
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // {children} is "the current page"
  return (
    // lang="en" = the page is in English (SEO + screen readers).
    <html lang="en">
      {/* min-h-screen = at least the screen's height, so the footer stays at the bottom */}
      <body className="flex min-h-screen flex-col">
        <Header />

        {/* <main> = the main content (only ONE per page — pages must not add another) */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
