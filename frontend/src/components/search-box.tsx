"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

const DEBOUNCE_MS = 300;
const MAX_LENGTH = 100;

/** Search field that keeps its text in the URL: ?query=... */
export function SearchBox({ placeholder }: { placeholder: string }) {
  // useSearchParams needs a Suspense boundary to be prerendered
  return (
    <Suspense fallback={<div className="mb-6 h-10" />}>
      <SearchField placeholder={placeholder} />
    </Suspense>
  );
}

function SearchField({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("query") ?? "";
  const [text, setText] = useState(urlQuery);
  const [sentQuery, setSentQuery] = useState(urlQuery);
  const [seenUrlQuery, setSeenUrlQuery] = useState(urlQuery);

  // The URL changed without us (Back button, menu link): show its text.
  if (urlQuery !== seenUrlQuery) {
    setSeenUrlQuery(urlQuery);
    if (urlQuery !== sentQuery) {
      setText(urlQuery);
      setSentQuery(urlQuery);
    }
  }

  const query = text.trim();

  useEffect(() => {
    if (query === sentQuery) return;

    // wait until typing stops, so "mouse" is one request and not five
    const timer = setTimeout(() => {
      setSentQuery(query);
      // only ?query= is kept: a new search starts again at page 1
      const suffix = query ? `?${new URLSearchParams({ query })}` : "";
      router.replace(`${pathname}${suffix}`, { scroll: false });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, sentQuery, pathname, router]);

  return (
    <form
      role="search"
      onSubmit={(event: FormEvent) => event.preventDefault()}
      className="mb-6"
    >
      <input
        type="search"
        name="query"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={MAX_LENGTH}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-md border border-zinc-300 bg-transparent px-3 dark:border-zinc-700"
      />
    </form>
  );
}
