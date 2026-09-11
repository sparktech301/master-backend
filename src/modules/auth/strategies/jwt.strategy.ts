import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import type * as express from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'secret',
      passReqToCallback: true,
    });
  }

  async validate(
    req: express.Request,
    paylode: { sub: string; phoneNumber: string; role: string },
  ) {
    const authorization = req.headers.authorization;
    const accessToken = authorization?.replace(/^Bearer\s+/i, '').trim();
    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isBlackListed = await this.redisService.exists(
      `auth:blacklist:access:${accessToken}`,
    );

    if (isBlackListed) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        id: paylode.sub,
      },
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        isPhoneVerification: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
