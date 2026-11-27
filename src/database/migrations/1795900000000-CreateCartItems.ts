// ─────────────────────────────────────────────────────────────────────────────
// FILE: CreateCartItems migration — creates the "cart_items" table.
// (What a migration is: see 1795700000000-AddUserRole.ts.)
//
// Each row = "this customer has N of this product in their cart".
// The N items are RESERVED: they were already taken out of products.stock_quantity.
// ─────────────────────────────────────────────────────────────────────────────

// MigrationInterface = the shape every migration must have; QueryRunner = sends SQL for us.
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartItems1795900000000 implements MigrationInterface {
  // The name TypeORM stores in its "migrations" table to remember this ran.
  name = 'CreateCartItems1795900000000';

  // up(): create the table.
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cart_items_id" PRIMARY KEY ("id"),
        -- A cart line always has at least 1 (0 means the line is deleted instead).
        CONSTRAINT "CHK_cart_items_quantity_positive" CHECK ("quantity" > 0),
        -- One line per product per customer (adding again raises the quantity).
        CONSTRAINT "UQ_cart_items_user_product" UNIQUE ("user_id", "product_id"),
        -- Erasing a user erases their cart.
        CONSTRAINT "FK_cart_items_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        -- RESTRICT = a product that is in someone's cart can't be erased (products are only soft-deleted anyway).
        CONSTRAINT "FK_cart_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT
      )`,
    );
  }

  // down(): remove it.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cart_items"`);
  }
}
