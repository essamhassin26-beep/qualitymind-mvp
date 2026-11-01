import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const t = await prisma.tenant.create({ data: { name: 'Nissan Egypt', industry: 'Auto' } });
  const p = await bcrypt.hash('Admin@123', 10);
  await prisma.user.create({ data: { tenantId: t.id, email: 'admin@nissan.com.eg', passwordHash: p, fullName: 'Admin', role: 'Admin' } });
  console.log('Seed completed! User: admin@nissan.com.eg / Admin@123');
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
