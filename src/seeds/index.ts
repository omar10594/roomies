import { db } from "../lib/db";
import { roomies, depositAccounts, payments, settings } from "../lib/db/schema";
import { generateId, toCents } from "../lib/utils";

const today = new Date();
const pad = (n: number) => String(n).padStart(2, "0");

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

async function seed() {
  console.log("Seeding database...");

  await db.insert(settings).values({
    key: "admin_access_code",
    value: "0000",
  });

  const roomie1Id = generateId();
  const roomie2Id = generateId();
  const roomie3Id = generateId();

  await db.insert(roomies).values([
    {
      id: roomie1Id,
      name: "Nubia",
      slug: "nubia",
      rentAmount: toCents(6500),
      rentDay: 5,
      isActive: true,
      accessCode: "1234",
    },
    {
      id: roomie2Id,
      name: "Felix Sanchez",
      slug: "felix",
      rentAmount: toCents(5500),
      rentDay: 1,
      isActive: true,
      accessCode: "5678",
    },
    {
      id: roomie3Id,
      name: "Marta Quiroz",
      slug: "marta",
      rentAmount: toCents(4500),
      rentDay: 15,
      isActive: true,
      accessCode: null,
    },
  ]);

  await db.insert(depositAccounts).values([
    {
      id: generateId(),
      clabe: "0121 8000 1234 5678 90",
      label: "BBVA - Renta Casa",
      isActive: true,
    },
    {
      id: generateId(),
      clabe: "0141 8000 9876 5432 10",
      label: "Santander - Servicios",
      isActive: true,
    },
  ]);

  const paymentsData = [
    { roomieId: roomie1Id, amount: toCents(6500), date: isoDate(2025, 8, 2), note: "Pago de renta - Septiembre" },
    { roomieId: roomie1Id, amount: toCents(6500), date: isoDate(2025, 7, 4), note: "Pago de renta - Agosto" },
    { roomieId: roomie1Id, amount: toCents(6500), date: isoDate(2025, 6, 1), note: "Pago de renta - Julio" },
    { roomieId: roomie2Id, amount: toCents(5500), date: isoDate(2025, 8, 1), note: "Pago de renta - Septiembre" },
    { roomieId: roomie2Id, amount: toCents(5500), date: isoDate(2025, 7, 1), note: "Pago de renta - Agosto" },
  ];

  for (const p of paymentsData) {
    await db.insert(payments).values({
      id: generateId(),
      ...p,
    });
  }

  console.log("Database seeded successfully!");
  console.log(`  - 1 admin setting`);
  console.log(`  - 3 roomies (nubia, felix, marta)`);
  console.log(`  - 2 deposit accounts`);
  console.log(`  - 5 payments`);
}

seed().catch(console.error);
