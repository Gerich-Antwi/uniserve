import { PrismaClient } from "./lib/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const result = await pool.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
        console.log("Native tables:", result.rows.map(r => r.tablename));

        console.log("Testing Prisma...");
        const msgs = await prisma.supportMessage.findMany();
        console.log("Prisma success:", msgs);
    } catch (e) {
        console.error("Prisma error:", e);
    } finally {
        await pool.end();
        await prisma.$disconnect();
    }
}
main();
