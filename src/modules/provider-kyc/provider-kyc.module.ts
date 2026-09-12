import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProviderKycController } from './provider-kyc.controller';
import { ProviderKycService } from './provider-kyc.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderKycController],
  providers: [ProviderKycService],
  exports: [ProviderKycService],
})
export class ProviderKycModule {}
