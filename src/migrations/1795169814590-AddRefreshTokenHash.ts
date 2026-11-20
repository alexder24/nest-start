import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenHash1795169814590 implements MigrationInterface {
    name = 'AddRefreshTokenHash1795169814590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token_hash" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token_hash"`);
    }

}
