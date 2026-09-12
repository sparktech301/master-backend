import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProviderReviewDto,
  UpdateProviderReviewDto,
} from './dto/provider-review.dto';

@Injectable()
export class ProviderReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProviderReviewDto) {
    await this.assertOrder(data.orderId);
    await this.assertProvider(data.providerId);
    await this.assertCustomer(data.customerId);

    return this.prisma.providerReview.upsert({
      where: { orderId: data.orderId },
      update: data,
      create: {
        ...data,
        continueWithProvider: data.continueWithProvider ?? false,
        isPublic: data.isPublic ?? true,
      },
      include: this.includeRelations(),
    });
  }

  findAll() {
    return this.prisma.providerReview.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  findByProvider(providerId: string) {
    return this.prisma.providerReview.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  findByCustomer(customerId: string) {
    return this.prisma.providerReview.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.providerReview.findUnique({
      where: { id },
      include: this.includeRelations(),
    });
    if (!review) throw new NotFoundException('Provider review not found');
    return review;
  }

  async update(id: string, data: UpdateProviderReviewDto) {
    await this.findOne(id);
    return this.prisma.providerReview.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.providerReview.delete({ where: { id } });
    return { message: 'Provider review deleted successfully' };
  }

  private includeRelations() {
    return {
      order: true,
      provider: { include: { user: true } },
      customer: { include: { user: true } },
    };
  }

  private async assertOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new BadRequestException('Order not found');
  }

  private async assertProvider(providerId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
    });
    if (!provider) throw new BadRequestException('Provider profile not found');
  }

  private async assertCustomer(customerId: string) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new BadRequestException('Customer profile not found');
  }
}
