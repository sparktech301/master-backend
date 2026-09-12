import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CustomerRetentionController } from './customer-retention.controller';
import { CustomerRetentionService } from './customer-retention.service';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerRetentionController],
  providers: [CustomerRetentionService],
  exports: [CustomerRetentionService],
})
export class CustomerRetentionModule {}
