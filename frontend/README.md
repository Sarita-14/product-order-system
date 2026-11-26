# Product frontend

Next.js app for the NestJS API in the parent folder: search and pagination.

## Run

```bash
npm run start:dev                       # parent folder: API on port 3000

npm install                             # this folder
cp .env.example .env.local
npm run dev                             # http://localhost:3001
```

## Pages

| URL | What it shows |
|---|---|
| `/search?query=` | Task 1: filter a list from the URL |
| `/products?page=` | Task 2: server-side pagination |
| `/products/client-pagination` | Task 3: client-side pagination with `useState` |
| `/products/pagination?query=&page=` | Tasks 4 + 5: search with `Prev 1 2 … 10 Next` |
| `/products/infinite-scroll?query=` | Scroll pagination, also with search |

The `…` needs more than 4 pages. To add 95 sample products to a development database:

```sql
INSERT INTO products (name, description, price, stock_quantity)
SELECT (ARRAY['Wireless Mouse','Keyboard','USB Cable','Monitor','Desk Lamp'])[1 + i % 5] || ' ' || i,
       'Sample product number ' || i, 100 + i, i % 7 * 10
FROM generate_series(1, 95) AS i;
```
