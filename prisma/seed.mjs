import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Characters", slug: "characters", icon: "\u{1F464}", description: "People and beings of the world", sortOrder: 0 },
  { name: "Locations", slug: "locations", icon: "\u{1F3F0}", description: "Places, cities, and regions", sortOrder: 1 },
  { name: "Factions", slug: "factions", icon: "\u2694\uFE0F", description: "Organizations, guilds, and groups", sortOrder: 2 },
  { name: "Events", slug: "events", icon: "\u{1F4DC}", description: "Historical events and battles", sortOrder: 3 },
  { name: "Items", slug: "items", icon: "\u{1F5E1}\uFE0F", description: "Artifacts, weapons, and objects", sortOrder: 4 },
  { name: "Lore", slug: "lore", icon: "\u{1F4D6}", description: "Myths, magic systems, and religions", sortOrder: 5 },
  { name: "Creatures", slug: "creatures", icon: "\u{1F409}", description: "Beasts, monsters, and wildlife", sortOrder: 6 },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Seeded categories:", categories.map((c) => c.name).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
