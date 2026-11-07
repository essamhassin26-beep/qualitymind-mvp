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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const part = await this.prisma.part.findFirst({
      where: { id, tenantId },
      include: {
        supplier: true,
        controlPlans: { where: { isActive: true }, take: 1 },
      },
    });
    if (!part) throw new NotFoundException('Part not found');
    return part;
  }

  create(tenantId: string, data: any) {
    return this.prisma.part.create({
      data: { ...data, tenantId },
    });
  }
}
