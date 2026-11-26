import { MigrationInterface, QueryRunner } from 'typeorm';

// Adds the login password (bcrypt hash) to users.
// Nullable: users that already exist have no password and simply can't log in.
export class AddUserPassword1795680000000 implements MigrationInterface {
  name = 'AddUserPassword1795680000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "password_hash"`);
  }
}