import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return console.log('No user found');

  const supplier = await prisma.supplier.create({
    data: { tenantId: user.tenantId, supplierCode: 'SUP-01', name: 'Test Supplier' }
  });

  const part = await prisma.part.create({
    data: { tenantId: user.tenantId, partNumber: 'PART-999', partName: 'Test Brake Pad', supplierId: supplier.id }
  });

  const inspection = await prisma.inspection.create({
    data: { 
      tenantId: user.tenantId, 
      partId: part.id, 
      inspectorId: user.id, 
      inspectionLocation: 'Incoming' 
    }
  });

  console.log('✅ تم إنشاء شيت فحص بنجاح!');
  console.log('👉 خد الـ ID ده وكوبي: ', inspection.id);
}
main().catch(console.error).finally(() => prisma.$disconnect());
