import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PartsModule } from './parts/parts.module';
import { InspectionsModule } from './inspections/inspections.module';

@Module({
  imports: [PrismaModule, AuthModule, PartsModule, InspectionsModule],
})
export class AppModule {}
