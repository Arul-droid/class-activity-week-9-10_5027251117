import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum diatur di file .env");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const dataAwal = [
    { nama: "Budi Santoso", nrp: "5027251001" },
    { nama: "Siti Aminah", nrp: "5027251002" },
    { nama: "Andi Pratama", nrp: "5027251003" },
  ];

  for (const mahasiswa of dataAwal) {
    await prisma.mahasiswa.upsert({
      where: { nrp: mahasiswa.nrp },
      update: { nama: mahasiswa.nama },
      create: mahasiswa,
    });
  }

  console.log("Proses seeding data mahasiswa selesai.");
}

main()
  .catch((error: unknown) => {
    console.error("Seeding gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
