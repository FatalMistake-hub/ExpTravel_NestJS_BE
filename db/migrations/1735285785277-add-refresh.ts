import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefresh1735285785277 implements MigrationInterface {
    name = 'AddRefresh1735285785277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "isValid" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "isValid"`);
    }

}
