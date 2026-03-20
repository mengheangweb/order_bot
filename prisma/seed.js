import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {

  console.log("🌱 Seeding products...")

  await prisma.product.createMany({
    data: [
      { name: "Salmon", price: 12, stock: 100 },
      { name: "Tiger Shrimp", price: 9, stock: 200 },
      { name: "Blue Crab", price: 8, stock: 50 },
      { name: "Lobster", price: 25, stock: 40 },
      { name: "King Crab", price: 22, stock: 30 },
      { name: "Snow Crab", price: 18, stock: 35 },
      { name: "Squid", price: 7, stock: 150 },
      { name: "Octopus", price: 15, stock: 60 },
      { name: "Sea Scallop", price: 14, stock: 80 },
      { name: "Mussel", price: 6, stock: 120 }
    ]
  })

  console.log("✅ Products seeded")

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())