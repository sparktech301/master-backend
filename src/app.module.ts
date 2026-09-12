import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ServiceModule } from './modules/services/services.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserAddressModule } from './modules/user-address/user-address.module';
import { TechnicianProfileModule } from './modules/technician-profile/technician-profile.module';
import { ProviderKycModule } from './modules/provider-kyc/provider-kyc.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    ServiceModule,
    ChatModule,
    UserAddressModule,
    TechnicianProfileModule,
    ProviderKycModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
