import { Body, Controller, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { PartsService } from './parts.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('parts')
@UseGuards(JwtAuthGuard)
export class PartsController {
  constructor(private service: PartsService) {}

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.service.findAll(req.user.tenantId, query);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.tenantId, id);
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user.tenantId, body);
  }

  @Post('bulk')
  bulkCreate(@Req() req: any, @Body() body: any[]) {
    return this.service.bulkCreate(req.user.tenantId, body);
  }
}
