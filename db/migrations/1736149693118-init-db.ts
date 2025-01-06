import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1736149693118 implements MigrationInterface {
    name = 'InitDb1736149693118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tours" RENAME COLUMN "tourId" TO "tour_id"`);
        await queryRunner.query(`ALTER TABLE "tours" RENAME CONSTRAINT "PK_081c970681edaefa1e9818d80b7" TO "PK_0c1435e4206fc101c7477a4cc98"`);
        await queryRunner.query(`ALTER SEQUENCE "tours_tourId_seq" RENAME TO "tours_tour_id_seq"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "categoryId" TO "category_id"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME CONSTRAINT "PK_c9594c262e6781893a1068d91be" TO "PK_51615bef2cea22812d0dcab6e18"`);
        await queryRunner.query(`ALTER SEQUENCE "categories_categoryId_seq" RENAME TO "categories_category_id_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER SEQUENCE "categories_category_id_seq" RENAME TO "categories_categoryId_seq"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME CONSTRAINT "PK_51615bef2cea22812d0dcab6e18" TO "PK_c9594c262e6781893a1068d91be"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "category_id" TO "categoryId"`);
        await queryRunner.query(`ALTER SEQUENCE "tours_tour_id_seq" RENAME TO "tours_tourId_seq"`);
        await queryRunner.query(`ALTER TABLE "tours" RENAME CONSTRAINT "PK_0c1435e4206fc101c7477a4cc98" TO "PK_081c970681edaefa1e9818d80b7"`);
        await queryRunner.query(`ALTER TABLE "tours" RENAME COLUMN "tour_id" TO "tourId"`);
    }

}
