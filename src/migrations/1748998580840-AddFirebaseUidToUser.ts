import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirebaseUidToUser1748998580840 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" 
            ADD COLUMN "firebaseUid" VARCHAR,
            ADD CONSTRAINT "UQ_user_firebaseUid" UNIQUE ("firebaseUid")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" 
            DROP CONSTRAINT "UQ_user_firebaseUid",
            DROP COLUMN "firebaseUid"
        `);
    }

}
