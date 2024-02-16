import { PrismaClient } from '@prisma/client';
import data from './data';

const prisma = new PrismaClient();

async function main() {
  for (const d of data) {
    try {
      await prisma[d.modelName].upsert({
        where: {
          [d.uniqueField]: d.data[d.uniqueField],
        },
        create: d.data,
        update: d.data,
      });
      console.log(
        `Created/updated ${d.modelName} of key ${d.data[d.uniqueField]}`,
      );
    } catch (e) {
      console.log(`Failed to create/update ${d.modelName}`, e);
    }
  }
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
