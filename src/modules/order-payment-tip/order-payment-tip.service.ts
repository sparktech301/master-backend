import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateOrderPaymentTipDto,
  UpdateOrderPaymentTipDto,
} from './dto/order-payment-tip.dto';

@Injectable()
export class OrderPaymentTipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderPaymentTipDto) {
    await this.assertOrder(data.orderId);

    return this.prisma.orderPaymentAndTip.upsert({
      where: { orderId: data.orderId },
      update: {
        paymentMode: data.paymentMode,
        serviceAmountPaid: data.serviceAmountPaid ?? 0,
        tipAmount: data.tipAmount ?? 0,
        hasTip: data.hasTip ?? (data.tipAmount ?? 0) > 0,
        confirmationStatus: data.confirmationStatus,
        confirmationDeadline: data.confirmationDeadline,
        customerConfirmedAt: data.customerConfirmedAt,
        disputeReason: data.disputeReason,
        varianceFlag: data.varianceFlag ?? false,
        isGuestOrder: data.isGuestOrder ?? false,
        completedByPartner: data.completedByPartner ?? false,
      },
      create: {
        orderId: data.orderId,
        paymentMode: data.paymentMode,
        serviceAmountPaid: data.serviceAmountPaid ?? 0,
        tipAmount: data.tipAmount ?? 0,
        hasTip: data.hasTip ?? (data.tipAmount ?? 0) > 0,
        confirmationStatus: data.confirmationStatus,
        confirmationDeadline: data.confirmationDeadline,
        customerConfirmedAt: data.customerConfirmedAt,
        disputeReason: data.disputeReason,
        varianceFlag: data.varianceFlag ?? false,
        isGuestOrder: data.isGuestOrder ?? false,
        completedByPartner: data.completedByPartner ?? false,
      },
      include: {
        order: true,
      },
    });
  }

  findAll() {
    return this.prisma.orderPaymentAndTip.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: true,
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.orderPaymentAndTip.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Order payment and tip not found');
    }

    return payment;
  }

  async findByOrder(orderId: string) {
    await this.assertOrder(orderId);

    return this.prisma.orderPaymentAndTip.findUnique({
      where: { orderId },
      include: {
        order: true,
      },
    });
  }

  async update(id: string, data: UpdateOrderPaymentTipDto) {
    await this.findOne(id);

    return this.prisma.orderPaymentAndTip.update({
      where: { id },
      data: {
        ...data,
        hasTip:
          data.hasTip ??
          (data.tipAmount !== undefined ? data.tipAmount > 0 : undefined),
      },
      include: {
        order: true,
      },
    });
  }

  async confirm(id: string) {
    await this.findOne(id);

    return this.prisma.orderPaymentAndTip.update({
      where: { id },
      data: {
        confirmationStatus: 'CONFIRMED',
        customerConfirmedAt: new Date(),
      },
      include: {
        order: true,
      },
    });
  }

  async dispute(id: string, disputeReason?: string) {
    if (!disputeReason?.trim()) {
      throw new BadRequestException('Dispute reason is required');
    }

    await this.findOne(id);

    return this.prisma.orderPaymentAndTip.update({
      where: { id },
      data: {
        confirmationStatus: 'DISPUTED',
        disputeReason,
        varianceFlag: true,
      },
      include: {
        order: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.orderPaymentAndTip.delete({
      where: { id },
    });

    return { message: 'Order payment and tip deleted successfully' };
  }

  private async assertOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }
  }
}
