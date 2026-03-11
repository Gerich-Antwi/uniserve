/**
 * One-time script: set readAt = createdAt for all messages where readAt is null.
 * This makes existing messages count as "read" so the Messages button badge
 * shows only the real number of unread messages (from the student to the provider).
 *
 * Run once: npx tsx scripts/backfill-message-read-at.ts
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/index";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 30000,
  ssl: true,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const toUpdate = await prisma.message.findMany({
    where: { readAt: null },
    select: { id: true, createdAt: true },
  });
  console.log(`Found ${toUpdate.length} message(s) with readAt null. Backfilling readAt = createdAt...`);
  let updated = 0;
  for (const m of toUpdate) {
    await prisma.message.update({
      where: { id: m.id },
      data: { readAt: m.createdAt },
    });
    updated++;
  }
  console.log(`Updated ${updated} message(s). Unread count will now match actual unread messages.`);
  await prisma.$disconnect();
  pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
