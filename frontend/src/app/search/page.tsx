import { Suspense } from "react";
import { SearchBox } from "@/components/search-box";
import { parseQuery } from "@/lib/search-params";

const ITEMS = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

// Task 1: filter a list with ?query=
export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Search</h1>
      <SearchBox placeholder="Search fruits…" />
      <Suspense fallback={<p>Loading…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Results({
  searchParams,
}: Pick<PageProps<"/search">, "searchParams">) {
  const query = parseQuery((await searchParams).query);
  const filtered = ITEMS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  if (filtered.length === 0) return <p>Nothing matches “{query}”.</p>;

  return (
    <ul className="list-disc pl-6">
      {filtered.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
