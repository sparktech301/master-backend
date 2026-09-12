import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrderPaymentTipController } from './order-payment-tip.controller';
import { OrderPaymentTipService } from './order-payment-tip.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrderPaymentTipController],
  providers: [OrderPaymentTipService],
  exports: [OrderPaymentTipService],
})
export class OrderPaymentTipModule {}
