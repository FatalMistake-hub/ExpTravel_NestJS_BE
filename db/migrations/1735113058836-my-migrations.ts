import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigrations1735113058836 implements MigrationInterface {
    name = 'MyMigrations1735113058836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userName" character varying(30) NOT NULL, "userEmail" character varying NOT NULL, "description" character varying, "address" character varying, "isWallet" boolean NOT NULL DEFAULT false, "phoneNumber" character varying, "language" character varying, "urlImage" character varying, "userPassword" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "accountAuthorize" character varying, "isEnabled" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName"), CONSTRAINT "UQ_9047b2d58f91586f14f0cf44a45" UNIQUE ("userEmail"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
