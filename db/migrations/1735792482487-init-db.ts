import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1735792482487 implements MigrationInterface {
    name = 'InitDb1735792482487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_details" DROP CONSTRAINT "FK_76be59dd5323be29c9d0eae05fe"`);
        await queryRunner.query(`ALTER TABLE "image_details" DROP COLUMN "tour_id"`);
        await queryRunner.query(`ALTER TABLE "image_details" ADD "tour_id" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "FK_bb6c71c8eb0099c35baf7484faa"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP CONSTRAINT "PK_081c970681edaefa1e9818d80b7"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "tourId"`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "tourId" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tours" ADD CONSTRAINT "PK_081c970681edaefa1e9818d80b7" PRIMARY KEY ("tourId")`);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "PK_ed6525fc861ed4b4cd67b1b1adc"`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "PK_aabc076ce0a59bbb5999b46f77d" PRIMARY KEY ("categoriesCategoryId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb6c71c8eb0099c35baf7484fa"`);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP COLUMN "toursTourId"`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD "toursTourId" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "PK_aabc076ce0a59bbb5999b46f77d"`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "PK_ed6525fc861ed4b4cd67b1b1adc" PRIMARY KEY ("categoriesCategoryId", "toursTourId")`);
        await queryRunner.query(`CREATE INDEX "IDX_bb6c71c8eb0099c35baf7484fa" ON "tour_category" ("toursTourId") `);
        await queryRunner.query(`ALTER TABLE "image_details" ADD CONSTRAINT "FK_76be59dd5323be29c9d0eae05fe" FOREIGN KEY ("tour_id") REFERENCES "tours"("tourId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "FK_bb6c71c8eb0099c35baf7484faa" FOREIGN KEY ("toursTourId") REFERENCES "tours"("tourId") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "FK_bb6c71c8eb0099c35baf7484faa"`);
        await queryRunner.query(`ALTER TABLE "image_details" DROP CONSTRAINT "FK_76be59dd5323be29c9d0eae05fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb6c71c8eb0099c35baf7484fa"`);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "PK_ed6525fc861ed4b4cd67b1b1adc"`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "PK_aabc076ce0a59bbb5999b46f77d" PRIMARY KEY ("categoriesCategoryId")`);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP COLUMN "toursTourId"`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD "toursTourId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_bb6c71c8eb0099c35baf7484fa" ON "tour_category" ("toursTourId") `);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "PK_aabc076ce0a59bbb5999b46f77d"`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "PK_ed6525fc861ed4b4cd67b1b1adc" PRIMARY KEY ("toursTourId", "categoriesCategoryId")`);
        await queryRunner.query(`ALTER TABLE "tours" DROP CONSTRAINT "PK_081c970681edaefa1e9818d80b7"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP COLUMN "tourId"`);
        await queryRunner.query(`ALTER TABLE "tours" ADD "tourId" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tours" ADD CONSTRAINT "PK_081c970681edaefa1e9818d80b7" PRIMARY KEY ("tourId")`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "FK_bb6c71c8eb0099c35baf7484faa" FOREIGN KEY ("toursTourId") REFERENCES "tours"("tourId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "image_details" DROP COLUMN "tour_id"`);
        await queryRunner.query(`ALTER TABLE "image_details" ADD "tour_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "image_details" ADD CONSTRAINT "FK_76be59dd5323be29c9d0eae05fe" FOREIGN KEY ("tour_id") REFERENCES "tours"("tourId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
