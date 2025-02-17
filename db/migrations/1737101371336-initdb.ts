import { MigrationInterface, QueryRunner } from "typeorm";

export class Initdb1737101371336 implements MigrationInterface {
    name = 'Initdb1737101371336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_name" character varying(30) NOT NULL, "user_email" character varying NOT NULL, "description" character varying, "address" character varying, "is_wallet" boolean NOT NULL DEFAULT false, "phone_number" character varying, "language" character varying, "url_image" character varying, "user_password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "account_authorize" character varying, "is_enabled" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_643a0bfb9391001cf11e581bdd6" UNIQUE ("user_email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "refresh_token_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token" character varying NOT NULL, "expire_date" TIMESTAMP NOT NULL, "is_valid" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_9dbdad80950b681a645b4f6373a" PRIMARY KEY ("refresh_token_id"))`);
        await queryRunner.query(`CREATE TABLE "image_details" ("image_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "link" character varying NOT NULL, "tour_id" bigint NOT NULL, CONSTRAINT "PK_701890421a5278e0b8dbc97f256" PRIMARY KEY ("image_id"))`);
        await queryRunner.query(`CREATE TABLE "time_book_details" ("time_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "day_book_id" uuid NOT NULL, "is_payment" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5f370a1cb709596dde9c01a5209" PRIMARY KEY ("time_id"))`);
        await queryRunner.query(`CREATE TABLE "daybooks" ("day_book_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date_name" date NOT NULL, "tour_id" bigint NOT NULL, "status" character varying, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_257121c04116fc7586c4906870e" PRIMARY KEY ("day_book_id"))`);
        await queryRunner.query(`CREATE TABLE "tours" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tour_id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL, "title" character varying, "rating" double precision NOT NULL, "city" character varying NOT NULL, "price_one_person" integer NOT NULL, "image_main" character varying NOT NULL, "working" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "time_slot_length" integer NOT NULL, "check_in" TIMESTAMP NOT NULL, "check_out" TIMESTAMP NOT NULL, "destination" character varying NOT NULL, "destination_description" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "PK_0c1435e4206fc101c7477a4cc98" PRIMARY KEY ("tour_id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" SERIAL NOT NULL, "category_name" character varying NOT NULL, "image_link" character varying NOT NULL, CONSTRAINT "PK_51615bef2cea22812d0dcab6e18" PRIMARY KEY ("category_id"))`);
        await queryRunner.query(`CREATE TABLE "tour_category" ("tour_id" bigint NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_e749c379c58f12b3f096dc5c6ae" PRIMARY KEY ("tour_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8f7342a004d790b6987435ca6b" ON "tour_category" ("tour_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_03acc4b520fac784046c429b9e" ON "tour_category" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image_details" ADD CONSTRAINT "FK_76be59dd5323be29c9d0eae05fe" FOREIGN KEY ("tour_id") REFERENCES "tours"("tour_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_book_details" ADD CONSTRAINT "FK_60c6185e685a3444377975a548c" FOREIGN KEY ("day_book_id") REFERENCES "daybooks"("day_book_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daybooks" ADD CONSTRAINT "FK_5539c0bde6c8d7aae58305954ee" FOREIGN KEY ("tour_id") REFERENCES "tours"("tour_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tours" ADD CONSTRAINT "FK_57db54d555b206eeb973828ffa6" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "FK_8f7342a004d790b6987435ca6b2" FOREIGN KEY ("tour_id") REFERENCES "tours"("tour_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tour_category" ADD CONSTRAINT "FK_03acc4b520fac784046c429b9eb" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "FK_03acc4b520fac784046c429b9eb"`);
        await queryRunner.query(`ALTER TABLE "tour_category" DROP CONSTRAINT "FK_8f7342a004d790b6987435ca6b2"`);
        await queryRunner.query(`ALTER TABLE "tours" DROP CONSTRAINT "FK_57db54d555b206eeb973828ffa6"`);
        await queryRunner.query(`ALTER TABLE "daybooks" DROP CONSTRAINT "FK_5539c0bde6c8d7aae58305954ee"`);
        await queryRunner.query(`ALTER TABLE "time_book_details" DROP CONSTRAINT "FK_60c6185e685a3444377975a548c"`);
        await queryRunner.query(`ALTER TABLE "image_details" DROP CONSTRAINT "FK_76be59dd5323be29c9d0eae05fe"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03acc4b520fac784046c429b9e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f7342a004d790b6987435ca6b"`);
        await queryRunner.query(`DROP TABLE "tour_category"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "tours"`);
        await queryRunner.query(`DROP TABLE "daybooks"`);
        await queryRunner.query(`DROP TABLE "time_book_details"`);
        await queryRunner.query(`DROP TABLE "image_details"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
