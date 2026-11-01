#!/bin/bash
echo "Creating folders..."
mkdir -p backend/src/auth backend/src/common/prisma backend/src/rules backend/prisma frontend/src

echo "Creating Backend files..."
cat << 'PKG' > backend/package.json
{
  "name": "qualitymind-backend",
  "version": "0.1.0",
  "scripts": {
    "build": "nest build",
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
    "@prisma/client": "^5.8.0",
    "bcrypt": "^5.1.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@types/bcrypt": "^5.0.2",
    "@types/node": "^20.11.0",
    "prisma": "^5.8.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
PKG

cat << 'PRISMA' > backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
model Tenant {
  id        String   @id @default(uuid())
  name      String
  users     User[]
}
model User {
  id        String   @id @default(uuid())
  tenantId  String
  email     String   @unique
  password  String
  role      String   @default("Inspector")
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
}
PRISMA

cat << 'MAIN' > backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('Backend is running on port 3000');
}
bootstrap();
MAIN

cat << 'APP' > backend/src/app.module.ts
import { Module } from '@nestjs/common';
@Module({ imports: [], controllers: [], providers: [] })
export class AppModule {}
APP

echo "Creating Frontend files..."
cat << 'FE_PKG' > frontend/package.json
{
  "name": "qualitymind-frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.11"
  }
}
FE_PKG

echo "Done! All files created successfully."
