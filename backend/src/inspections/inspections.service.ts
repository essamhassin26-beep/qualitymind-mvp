import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { applyBR001 } from '../rules/br-001.matrix';
@Injectable()
export class InspectionsService {
  constructor(private prisma: PrismaService) {}
  async addResult(tenantId: string, inspId: string, data: any) {
    const res = await this.prisma.inspectionResult.create({ data: { inspectionId: inspId, result: data.result, severity: data.severity, defectCode: data.defectCode } });
    if (data.result === 'NG') {
      const action = applyBR001('Incoming', data.severity);
      if (action.autoPIR) {
        const insp = await this.prisma.inspection.findUnique({ where: { id: inspId } });
        await this.prisma.pIR.create({ data: { tenantId, pirNumber: 'PIR-'+Date.now(), partId: insp.partId } });
      }
    }
    return res;
  }
}
