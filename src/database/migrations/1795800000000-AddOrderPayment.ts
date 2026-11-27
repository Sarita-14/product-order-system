// ─────────────────────────────────────────────────────────────────────────────
// FILE: AddOrderPayment migration — adds 2 payment columns to the orders table.
// (What a migration is: see 1795700000000-AddUserRole.ts.)
//
//   razorpay_order_id   = the id Razorpay gives when we START a payment ("order_Abc123")
//   razorpay_payment_id = the id Razorpay gives when the payment SUCCEEDS ("pay_Xyz789")
// Both are empty (NULL) until a payment happens.
// ─────────────────────────────────────────────────────────────────────────────

// MigrationInterface = the shape every migration must have; QueryRunner = sends SQL for us.
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderPayment1795800000000 implements MigrationInterface {
  // The name TypeORM stores in its "migrations" table to remember this ran.
  name = 'AddOrderPayment1795800000000';

  // up(): apply the change.
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Two text columns; no NOT NULL, so existing orders simply get NULL (= no payment yet).
    await queryRunner.query(
      `ALTER TABLE "orders" ADD COLUMN "razorpay_order_id" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD COLUMN "razorpay_payment_id" character varying(255)`,
    );
  }

  // down(): undo it, in reverse order.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "razorpay_payment_id"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "razorpay_order_id"`);
  }
}
