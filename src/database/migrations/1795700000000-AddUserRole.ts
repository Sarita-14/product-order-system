// ─────────────────────────────────────────────────────────────────────────────
// FILE: AddUserRole migration — adds the "role" column to the users table.
//
// CONCEPT — "migration": a small script that changes the database structure
//   step by step (add a column, add a type...). Each migration runs ONCE.
//   TypeORM remembers which ones already ran (in a "migrations" table).
//   - up()   = apply the change   (npm run migration:run)
//   - down() = undo the change    (npm run migration:revert)
//   The number in the file/class name is a timestamp: migrations run in that order.
//
// Every existing user becomes a customer (the default);
// the first admin is promoted by hand with an UPDATE.
// ─────────────────────────────────────────────────────────────────────────────

// MigrationInterface = the shape every migration must have (up + down).
// QueryRunner = the object that sends SQL (the database's own command language) to the database for us.
import { MigrationInterface, QueryRunner } from 'typeorm';

// "implements MigrationInterface" = TypeScript checks we wrote both up() and down().
export class AddUserRole1795700000000 implements MigrationInterface {
  // The name TypeORM stores in its "migrations" table to remember this ran.
  name = 'AddUserRole1795700000000';

  // up(): runs when we apply the migration. "async" + "await" = wait for each SQL step to finish.
  public async up(queryRunner: QueryRunner): Promise<void> {
    // SQL step 1: create a Postgres "enum type" = a column type that only accepts these 2 words.
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('customer', 'admin')`,
    );
    // SQL step 2: add the column "role" of that type to the users table.
    // NOT NULL = it can never be empty; DEFAULT 'customer' = existing and new rows get 'customer'.
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "role" "public"."user_role_enum" NOT NULL DEFAULT 'customer'`,
    );
  }

  // down(): the exact opposite of up(), in reverse order.
  public async down(queryRunner: QueryRunner): Promise<void> {
    // First remove the column (it uses the type)...
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    // ...then the type itself can be removed.
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
