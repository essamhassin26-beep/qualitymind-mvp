import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log('No user found');
  
  let supplier = await prisma.supplier.findFirst({ where: { tenantId: user.tenantId } });
  if (!supplier) {
    supplier = await prisma.supplier.create({
      data: { tenantId: user.tenantId, supplierCode: 'REAL-SUP-01', name: 'مورد السحابة الحقيقي' }
    });
  }

  await prisma.part.create({
    data: {
      tenantId: user.tenantId,
      partNumber: 'REAL-PART-999',
      partName: 'قطعة غيار حقيقية من الداتابيز',
      supplierId: supplier.id,
      importantPartClass: 'A'
    }
  });
  console.log('✅ تمت إضافة القطعة الحقيقية بنجاح!');
}
main().finally(() => prisma.$disconnect());
