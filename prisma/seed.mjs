// Seed script: creates a demo user with a handful of applications.
// Run with:  npm run db:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@jobtrackr.dev";
const DEMO_PASSWORD = "demo1234";

const SAMPLE_APPLICATIONS = [
  {
    company: "Vercel",
    position: "Senior Frontend Engineer",
    location: "Remote",
    salary: "$150k–$190k",
    jobUrl: "https://vercel.com/careers",
    status: "INTERVIEW",
    notes: "Take-home done. Onsite loop scheduled next week.",
  },
  {
    company: "Stripe",
    position: "Full-stack Engineer",
    location: "Singapore",
    salary: "$120k–$160k",
    status: "APPLIED",
    notes: "Referred by a former colleague.",
  },
  {
    company: "Grab",
    position: "Backend Engineer (Go)",
    location: "Bangkok",
    salary: "฿120k–150k/mo",
    status: "OFFER",
    notes: "Verbal offer received — negotiating equity.",
  },
  {
    company: "Line",
    position: "React Native Developer",
    location: "Bangkok · Hybrid",
    status: "REJECTED",
    notes: "Rejected after final round. Ask for feedback.",
  },
  {
    company: "Agoda",
    position: "Software Engineer",
    location: "Bangkok",
    salary: "฿100k–140k/mo",
    status: "WISHLIST",
    notes: "Great tech blog. Watch for open roles.",
  },
  {
    company: "SCB TechX",
    position: "Full-stack Developer",
    location: "Bangkok",
    status: "WISHLIST",
  },
];

async function main() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: { name: "Demo User", email: DEMO_EMAIL, password },
  });

  // Start from a clean slate for repeatable seeds.
  await prisma.jobApplication.deleteMany({ where: { userId: user.id } });
  await prisma.jobApplication.createMany({
    data: SAMPLE_APPLICATIONS.map((a) => ({ ...a, userId: user.id })),
  });

  console.log(`Seeded ${SAMPLE_APPLICATIONS.length} applications.`);
  console.log(`Demo login →  ${DEMO_EMAIL}  /  ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
