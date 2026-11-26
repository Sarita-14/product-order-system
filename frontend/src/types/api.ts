// ─────────────────────────────────────────────────────────────────────────────
// FILE: types/api.ts — the "envelope" around every successful backend answer.
//
// Every SUCCESSFUL response from our NestJS API is wrapped like this:
// { success: true, statusCode: 200, data: <the real content>, timestamp: "..." }
//
// CONCEPT — "generic" <T>: a blank to fill in later. T means "some type we name when we use it".
//   ApiResponse<Product[]> = an envelope whose `data` is a list of products.
//   ApiResponse<User>      = an envelope whose `data` is one user.
// ─────────────────────────────────────────────────────────────────────────────

// "export interface" = the shape of an object (no real code is produced).
export interface ApiResponse<T> {
  success: boolean; // true for every success answer
  statusCode: number; // e.g. 200 (OK) or 201 (Created)
  data: T; // the real content, e.g. a list of products: [ { "id": "…", "name": "Wireless Mouse", … } ]
  timestamp: string; // when the backend answered, as text
}
