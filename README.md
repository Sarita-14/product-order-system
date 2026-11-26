# Product & Order Management API

NestJS REST API for products, orders with atomic stock deduction, and order confirmation emails via Resend.

**Stack:** NestJS · PostgreSQL · TypeORM · class-validator · Swagger · Resend

## Setup

```bash
npm install
cp .env.example .env        # fill in DB credentials and RESEND_API_KEY
npm run migration:run
npm run start:dev
```

Swagger: `http://localhost:3000/api/v1/docs`

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST / GET | `/users`, `/users/:id` | Create / list / get users |
| POST / GET | `/products`, `/products/:id` | Create / list / get products |
| GET | `/products?query=&page=&limit=` | Search + pagination; returns `{ items, meta }` |
| PATCH | `/products/:id` | Update product |
| DELETE | `/products/:id` | Soft delete (204) |
| POST | `/orders` | Place order `{ userId, items: [{ productId, quantity }] }` |
| GET | `/orders`, `/orders/:id` | List / get orders with items |

## How an order is placed

1. Validate the body (items not empty, each product once, quantity ≥ 1).
2. In one DB transaction: lock the products (`SELECT ... FOR UPDATE`), check stock, deduct it, save the order and items.
3. Any error rolls everything back. Stock can never go negative (row lock + DB `CHECK` constraint).
4. After commit, the confirmation email is sent; an email failure is logged and never fails the order.