import { PrismaClient } from "./lib/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function main() {
    const connectionString = process.env.DATABASE_URL!;
    console.log("URL:", connectionString.split("@")[1]);
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const client = await pool.connect();
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS "support_message" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "subject" TEXT NOT NULL,
                "message" TEXT NOT NULL,
                "status" TEXT NOT NULL DEFAULT 'Open',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT "support_message_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log("SQL CREATE TABLE executed.");

        const res = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
        console.log("Native tables:", res.rows.map(r => r.tablename).includes('support_message') ? "Exists" : "Missing");

        client.release();

        console.log("Testing Prisma...");
        const msgs = await prisma.supportMessage.findMany();
        console.log("Prisma success:", msgs.length, "messages");
    } catch (e) {
        console.error("Prisma error:", e);
    } finally {
        await pool.end();
        await prisma.$disconnect();
    }
}
main();
