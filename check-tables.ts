import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({ connectionString });
    
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
        console.log("Tables in public schema:", result.rows);

        // Try creating standard table without quotes
        await client.query(`
            CREATE TABLE IF NOT EXISTS support_message (
                id TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Open',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,
                CONSTRAINT support_message_pkey PRIMARY KEY (id)
            );
        `);
        console.log("Created without quotes if not exists.");

        const result2 = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
        console.log("Tables in public schema after retry:", result2.rows);

        client.release();
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}
main();
