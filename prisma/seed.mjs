import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "People", slug: "people", icon: "\u{1F464}", description: "Individuals and notable figures", sortOrder: 0 },
  { name: "Places", slug: "places", icon: "\u{1F4CD}", description: "Locations, cities, and regions", sortOrder: 1 },
  { name: "Organizations", slug: "organizations", icon: "\u{1F3DB}\uFE0F", description: "Groups, teams, and institutions", sortOrder: 2 },
  { name: "Events", slug: "events", icon: "\u{1F4C5}", description: "Notable events and occurrences", sortOrder: 3 },
  { name: "Things", slug: "things", icon: "\u{1F4E6}", description: "Objects, items, and artifacts", sortOrder: 4 },
  { name: "Concepts", slug: "concepts", icon: "\u{1F4D6}", description: "Ideas, systems, and knowledge", sortOrder: 5 },
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
