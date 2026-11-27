// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/routes.ts — every URL the app builds lives here, so a path is
// never typed twice. If a URL changes, we change it in ONE place.
// ─────────────────────────────────────────────────────────────────────────────

// Pages that need a login. proxy.ts redirects visitors away from them and
// robots.ts tells search engines not to crawl them.
export const PRIVATE_PATHS = ['/dashboard', '/orders', '/checkout', '/cart', '/admin'];

// isPrivatePath('/orders/123') -> true.  isPrivatePath('/products/1') -> false.
// .some(...) = "is at least ONE item in the list matching?"
export const isPrivatePath = (pathname: string) =>
  // match the page itself ("/orders") or anything under it ("/orders/123")
  PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

// Admin area (used by the admin nav and the admin actions)
// "as const" = these values never change (TypeScript then knows the exact texts).
export const ADMIN_PATHS = {
  dashboard: '/admin',
  products: '/admin/products',
  orders: '/admin/orders',
  users: '/admin/users',
} as const;

// The cart page (anyone may use it; checkout then asks for a login).
export const CART_PATH = '/cart';

// productPath('abc') -> '/products/abc'   (the `${...}` puts the value inside the text)
export const productPath = (id: string) => `/products/${id}`;
// The id of the "Customer reviews" section on the product page (the part after "#" in a URL).
export const REVIEWS_SECTION_ID = 'reviews';
// productReviewsPath('abc') -> '/products/abc#reviews' (opens the page scrolled to the reviews + form)
export const productReviewsPath = (id: string) => `${productPath(id)}#${REVIEWS_SECTION_ID}`;
// loginPath('/x') -> '/login?from=%2Fx' (come back to /x after signing in, like proxy.ts does)
export const loginPath = (from: string) => `/login?from=${encodeURIComponent(from)}`;
// The checkout page (it shows the cart; "Order now" adds to the cart, then comes here).
export const CHECKOUT_PATH = '/checkout';
// orderPath('abc') -> '/orders/abc'
export const orderPath = (id: string) => `/orders/${id}`;
// editProductPath('abc') -> '/admin/products/abc/edit'
export const editProductPath = (id: string) => `/admin/products/${id}/edit`;
