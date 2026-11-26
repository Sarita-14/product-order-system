import type { NextRequest } from "next/server";
import { fetchProducts } from "@/lib/api";
import { parsePage, parseQuery } from "@/lib/search-params";

// Called by the infinite scroll in the browser: /api/products?query=mouse&page=2
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    return Response.json(
      await fetchProducts({
        query: parseQuery(params.get("query")),
        page: parsePage(params.get("page")),
      }),
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Could not load products" },
      { status: 502 },
    );
  }
}
