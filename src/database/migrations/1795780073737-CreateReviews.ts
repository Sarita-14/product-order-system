import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReviews1795780073737 implements MigrationInterface {
    name = 'CreateReviews1795780073737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_cart_items_user"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_cart_items_product"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_reviews_product"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_reviews_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_reviews_product_created"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "CHK_reviews_rating_1_to_5"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_reviews_product_user"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "author_name"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "reviewer_name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "CHK_reviews_rating_range" CHECK ("rating" BETWEEN 1 AND 5)`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_reviews_user_product" UNIQUE ("user_id", "product_id")`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "UQ_reviews_user_product"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "CHK_reviews_rating_range"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "reviewer_name"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "author_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "UQ_reviews_product_user" UNIQUE ("product_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "CHK_reviews_rating_1_to_5" CHECK (((rating >= 1) AND (rating <= 5)))`);
        await queryRunner.query(`CREATE INDEX "IDX_reviews_product_created" ON "reviews" USING btree ("created_at", "product_id") `);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_reviews_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_reviews_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_cart_items_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_cart_items_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
