import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) throw new UnauthorizedException();
    return { access_token: this.jwt.sign({ sub: user.id, tenant_id: user.tenantId, role: user.role }) };
  }
}
