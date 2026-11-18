import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductStockCheck1795023661918 implements MigrationInterface {
    name = 'AddProductStockCheck1795023661918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "CHK_products_stock_non_negative" CHECK ("stock_quantity" >= 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "CHK_products_stock_non_negative"`);
    }

}
