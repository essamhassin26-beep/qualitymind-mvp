import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private srv: InspectionsService) {}
  @Post(':id/results')
  addResult(@Req() req: any, @Param('id') id: string, @Body() b: any) {
    return this.srv.addResult(req.user.tenantId, id, b);
  }
}
