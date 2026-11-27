# Product & Order Management API

NestJS REST API for products, orders with atomic stock deduction, Razorpay payments, product reviews, and order confirmation emails via Resend. The Next.js frontend lives in `frontend/`.

**Stack:** NestJS · PostgreSQL · TypeORM · class-validator · Swagger · Resend · Razorpay

## Setup

```bash
npm install
cp .env.example .env        # fill in DB credentials, JWT_SECRET, RESEND_API_KEY (+ Razorpay keys, see below)
npm run migration:run       # run this again after every pull that adds a migration
npm run start:dev
```

Swagger: `http://localhost:3000/api/v1/docs`

Frontend: `cd frontend && cp .env.example .env.local && npm install && npm run dev` (http://localhost:3001)

### First admin

Every new account is a `customer`. Promote one by hand, then sign out and back in:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

### Razorpay (payments)

1. In the Razorpay dashboard switch to **Test mode** → Settings → API Keys → Generate key.
2. Put them in `.env`: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`. Restart the backend.
3. Pay an order with the test card `4111 1111 1111 1111`, any future expiry, any CVV.

Without the keys the app still runs; the Pay button answers "Online payment is not configured".

**Webhook (recommended):** confirms a payment even if the customer closes the tab before the browser reports back.
Razorpay → Settings → Webhooks → Add: URL `https://<your-public-backend>/api/v1/payments/razorpay/webhook`, events `payment.captured`, `payment.failed`, `order.paid`, and a secret you choose → put it in `RAZORPAY_WEBHOOK_SECRET`.
Razorpay must reach the URL from the internet; on your own computer use a tunnel such as `ngrok http 3000`.

## Endpoints

| Method | Endpoint | Who | Description |
|---|---|---|---|
| POST | `/auth/register`, `/auth/login` | anyone | Create an account / get a JWT |
| GET | `/auth/me` | logged in | The current user |
| GET | `/users` | admin | All users |
| GET | `/products`, `/products/:id` | anyone | List (optional `?search=`) / get products |
| POST / PATCH / DELETE | `/products`, `/products/:id` | admin | Create / update / soft delete (204) |
| POST | `/orders` | logged in | Place order `{ items: [{ productId, quantity }] }` (status PENDING) |
| GET | `/orders/my`, `/orders/:id` | logged in | My orders / one order |
| PATCH | `/orders/:id/cancel` | owner | Cancel a PENDING/FAILED order (stock restored) |
| GET, PATCH | `/orders`, `/orders/:id/status` | admin | All orders / CONFIRMED → SHIPPED → DELIVERED |
| POST | `/orders/:id/payment` | owner | Start a Razorpay payment (popup details) |
| POST | `/orders/:id/payment/verify` | owner | Check Razorpay's signature → CONFIRMED (or FAILED) |
| POST | `/orders/:id/payment/fail` | owner | Payment failed in the popup → FAILED |
| POST | `/payments/razorpay/webhook` | Razorpay | Signed webhook → CONFIRMED / FAILED |
| GET | `/products/:id/reviews` | anyone | A product's reviews, newest first |
| POST | `/products/:id/reviews` | logged in | Add a review `{ rating: 1-5, comment }` (once per product) |

## How an order is placed

1. Validate the body (items not empty, each product once, quantity ≥ 1).
2. In one DB transaction: lock the products (`SELECT ... FOR UPDATE`), check stock, deduct it, save the order and items.
3. Any error rolls everything back. Stock can never go negative (row lock + DB `CHECK` constraint).
4. After commit, the confirmation email is sent; an email failure is logged and never fails the order.

## How an order is paid

1. **Pay** → the backend creates a Razorpay order for the total **from the database** and saves its id.
2. The customer pays in Razorpay's popup.
3. The browser forwards Razorpay's signature; the backend checks it with the secret key → **CONFIRMED**. A bad signature or a failed payment → **FAILED** (the customer can pay again or cancel).
4. The webhook does the same independently. Every status change is "only if still PENDING/FAILED", so a repeated or late event never undoes anything.
