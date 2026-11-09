import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PartsService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string, filters: { supplierId?: string; search?: string }) {
    return this.prisma.part.findMany({
      where: {
        tenantId,
        ...(filters.supplierId && { supplierId: filters.supplierId }),
        ...(filters.search && {
          OR: [
            { partNumber: { contains: filters.search, mode: 'insensitive' } },
            { partName: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { supplier: true },
    });
  }

  async findOne(tenantId: string, id: string) {
    const part = await this.prisma.part.findFirst({
      where: { id, tenantId },
      include: { supplier: true },
    });
    if (!part) throw new NotFoundException('Part not found');
    return part;
  }

  create(tenantId: string, data: any) {
    return this.prisma.part.create({ data: { ...data, tenantId } });
  }

  async bulkCreate(tenantId: string, data: any[]) {
    let supplier = await this.prisma.supplier.findFirst({ where: { tenantId } });
    if (!supplier) {
      supplier = await this.prisma.supplier.create({
        data: { tenantId, supplierCode: 'DEFAULT', name: 'Default Supplier' }
      });
    }

    for (const item of data) {
      await this.prisma.part.upsert({
        where: { tenantId_partNumber: { tenantId, partNumber: item.partNumber } },
        update: { partName: item.partName, checkPoints: item.checkPoints },
        create: {
          tenantId, partNumber: item.partNumber, partName: item.partName,
          supplierId: supplier.id, checkPoints: item.checkPoints,
        }
      });
    }
    return { success: true, count: data.length };
  }
}
