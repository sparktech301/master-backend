import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProviderReviewController } from './provider-review.controller';
import { ProviderReviewService } from './provider-review.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderReviewController],
  providers: [ProviderReviewService],
})
export class ProviderReviewModule {}
