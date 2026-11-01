#!/bin/bash
echo "Writing Full Backend Code..."
mkdir -p backend/src/auth backend/src/common/prisma backend/src/rules backend/src/parts backend/src/inspections backend/prisma frontend/src/lib frontend/src/pages frontend/src/components

cat << 'PKG' > backend/package.json
{
  "name": "qualitymind-backend",
  "version": "0.1.0",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/swagger": "^7.2.0",
    "@prisma/client": "^5.8.0",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@types/bcrypt": "^5.0.2",
    "@types/node": "^20.11.0",
    "@types/passport-jwt": "^4.0.0",
    "prisma": "^5.8.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
PKG

cat << 'TSCONFIG' > backend/tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false
  }
}
TSCONFIG

cat << 'NESTCLI' > backend/nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
NESTCLI

cat << 'MAIN' > backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('QualityMind AI API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
MAIN

cat << 'APPMODULE' > backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PartsModule } from './parts/parts.module';
import { InspectionsModule } from './inspections/inspections.module';

@Module({
  imports: [PrismaModule, AuthModule, PartsModule, InspectionsModule],
})
export class AppModule {}
APPMODULE

cat << 'PRISMAMODULE' > backend/src/common/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
PRISMAMODULE

cat << 'PRISMASERVICE' > backend/src/common/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
}
PRISMASERVICE

cat << 'PRISMA' > backend/prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

model Tenant {
  id String @id @default(uuid())
  name String
  industry String?
  users User[]
  suppliers Supplier[]
  parts Part[]
}
model User {
  id String @id @default(uuid())
  tenantId String
  email String @unique
  passwordHash String
  fullName String
  role String @default("Inspector")
  tenant Tenant @relation(fields: [tenantId], references: [id])
  inspections Inspection[]
}
model Supplier {
  id String @id @default(uuid())
  tenantId String
  supplierCode String
  name String
  tenant Tenant @relation(fields: [tenantId], references: [id])
  parts Part[]
  @@unique([tenantId, supplierCode])
}
model Part {
  id String @id @default(uuid())
  tenantId String
  partNumber String
  partName String
  supplierId String
  tenant Tenant @relation(fields: [tenantId], references: [id])
  supplier Supplier @relation(fields: [supplierId], references: [id])
  inspections Inspection[]
  pirs PIR[]
  @@unique([tenantId, partNumber])
}
model Inspection {
  id String @id @default(uuid())
  tenantId String
  partId String
  inspectorId String
  inspectionLocation String
  status String @default("UnderReview")
  part Part @relation(fields: [partId], references: [id])
  inspector User @relation(fields: [inspectorId], references: [id])
  results InspectionResult[]
}
model InspectionResult {
  id String @id @default(uuid())
  inspectionId String
  result String
  severity String?
  defectCode String?
  inspection Inspection @relation(fields: [inspectionId], references: [id])
}
model PIR {
  id String @id @default(uuid())
  tenantId String
  pirNumber String @unique
  partId String
  status String @default("OPEN")
  part Part @relation(fields: [partId], references: [id])
}
PRISMA

cat << 'SEED' > backend/prisma/seed.ts
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
SEED

echo "Writing Auth Module..."
cat << 'AUTHMOD' > backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [PassportModule, JwtModule.register({ secret: 'secret123', signOptions: { expiresIn: '1d' } })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
AUTHMOD

cat << 'AUTHSERV' > backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) throw new UnauthorizedException();
    return { access_token: this.jwt.sign({ sub: user.id, tenant_id: user.tenantId, role: user.role }) };
  }
}
AUTHSERV

cat << 'AUTHCON' > backend/src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('login')
  login(@Body() body: any) { return this.auth.login(body.email, body.password); }
}
AUTHCON

cat << 'JWTST' > backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() { super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'secret123' }); }
  validate(payload: any) { return { userId: payload.sub, tenantId: payload.tenant_id, role: payload.role }; }
}
JWTST

cat << 'JWTGUARD' > backend/src/auth/jwt.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
JWTGUARD

echo "Writing BR-001 & Inspections..."
cat << 'BR001' > backend/src/rules/br-001.matrix.ts
export function applyBR001(loc: string, sev: string) {
  if (sev === 'V1') return { autoPIR: true, stopLine: loc === 'Line' };
  if (sev === 'V2') return { autoPIR: true, stopLine: false };
  return { autoPIR: false, stopLine: false };
}
BR001

cat << 'INSPMOD' > backend/src/inspections/inspections.module.ts
import { Module } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';
@Module({ controllers: [InspectionsController], providers: [InspectionsService] })
export class InspectionsModule {}
INSPMOD

cat << 'INSPSERV' > backend/src/inspections/inspections.service.ts
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
INSPSERV

cat << 'INSPCON' > backend/src/inspections/inspections.controller.ts
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
INSPCON

echo "Writing Frontend..."
cat << 'FEPKG' > frontend/package.json
{
  "name": "qualitymind-frontend",
  "version": "0.1.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build" },
  "dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0", "react-router-dom": "^6.21.0" },
  "devDependencies": { "@types/react": "^18.2.48", "@types/react-dom": "^18.2.18", "@vitejs/plugin-react": "^4.2.1", "vite": "^5.0.11" }
}
FEPKG

cat << 'VITE' > frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })
VITE

cat << 'INDEX' > frontend/index.html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>QualityMind</title></head>
<body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
INDEX

cat << 'FEMAIN' > frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
)
FEMAIN

cat << 'FEAPP' > frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>QualityMind AI MVP</h1>
        <p>المنصة شغالة بنجاح! 🎉</p>
      </div>
    </BrowserRouter>
  );
}
FEAPP

echo "✅ All REAL code updated successfully!"
