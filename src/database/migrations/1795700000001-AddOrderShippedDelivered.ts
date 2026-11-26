// ─────────────────────────────────────────────────────────────────────────────
// FILE: AddOrderShippedDelivered migration.
// Adds SHIPPED and DELIVERED to order_status_enum, and new orders now start as PENDING.
// (What a migration is: see the comment at the top of AddUserRole migration.)
// ─────────────────────────────────────────────────────────────────────────────

// MigrationInterface = required shape (up + down); QueryRunner = sends SQL for us.
import { MigrationInterface, QueryRunner } from 'typeorm';

// The number at the end is the timestamp: it runs right after AddUserRole.
export class AddOrderShippedDelivered1795700000001 implements MigrationInterface {
  // Name stored by TypeORM to remember this migration already ran.
  name = 'AddOrderShippedDelivered1795700000001';

  // up(): apply the change.
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the word 'SHIPPED' to the list of allowed order statuses.
    // IF NOT EXISTS = don't fail if it was already added.
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum" ADD VALUE IF NOT EXISTS 'SHIPPED'`,
    );
    // Same for 'DELIVERED'.
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum" ADD VALUE IF NOT EXISTS 'DELIVERED'`,
    );
    // An order inserted without a status now gets 'PENDING' (it used to be 'CONFIRMED').
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
  }

  // Postgres can't remove a value from an enum, so down() rebuilds the type:
  // shipped/delivered orders go back to CONFIRMED, then the old 4-value type is restored.
  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remove the default for now (it points at the type we are about to replace).
    await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
    // 2. Orders that use the new words go back to CONFIRMED, so they fit the old list.
    await queryRunner.query(
      `UPDATE "orders" SET "status" = 'CONFIRMED' WHERE "status" IN ('SHIPPED', 'DELIVERED')`,
    );
    // 3. Rename the current type out of the way.
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`,
    );
    // 4. Create the type again with only the 4 original words.
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED')`,
    );
    // 5. Switch the column to the new type (convert each value: old type -> text -> new type).
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."order_status_enum" USING "status"::text::"public"."order_status_enum"`,
    );
    // 6. Nothing uses the old type now, so delete it.
    await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
    // 7. Put back the original default.
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED'`,
    );
  }
}
