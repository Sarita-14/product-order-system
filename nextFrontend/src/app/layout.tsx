import { Suspense } from 'react';
import UserMenu from '@/components/user-menu';
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Order System",
  description: "Search and pagination with Next.js and NestJS",
};

const links = [
  { href: "/search", label: "Search" },
  { href: "/products", label: "Server pages" },
  { href: "/products/client-pagination", label: "Client pages" },
  { href: "/products/pagination", label: "Search + pages" },
  { href: "/products/infinite-scroll", label: "Infinite scroll" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="mx-auto max-w-3xl px-4 pb-16">
        <nav
          aria-label="Main"
          className="mb-8 flex flex-wrap gap-x-5 gap-y-2 border-b border-zinc-200 py-4 text-sm dark:border-zinc-800"
        >
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:underline">
              {label}
            </Link>
          ))}
        </nav>
        <Suspense fallback={null}>
       <UserMenu />
      </Suspense>
        <main>{children}</main>
      </body>
    </html>
  );
}
