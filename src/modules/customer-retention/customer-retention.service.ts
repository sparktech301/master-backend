import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCustomerRetentionDto,
  UpdateCustomerRetentionDto,
} from './dto/customer-retention.dto';

@Injectable()
export class CustomerRetentionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerRetentionDto) {
    await this.assertProvider(data.providerId);
    await this.assertCustomer(data.customerId);

    return this.prisma.customerRetention.upsert({
      where: {
        providerId_customerId: {
          providerId: data.providerId,
          customerId: data.customerId,
        },
      },
      update: {
        isChatActive: data.isChatActive ?? true,
        removedReason: data.removedReason,
      },
      create: {
        providerId: data.providerId,
        customerId: data.customerId,
        isChatActive: data.isChatActive ?? true,
        removedReason: data.removedReason,
      },
      include: this.includeRelations(),
    });
  }

  findAll() {
    return this.prisma.customerRetention.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  findByProvider(providerId: string) {
    return this.prisma.customerRetention.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  findByCustomer(customerId: string) {
    return this.prisma.customerRetention.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  async findOne(id: string) {
    const retention = await this.prisma.customerRetention.findUnique({
      where: { id },
      include: this.includeRelations(),
    });

    if (!retention) {
      throw new NotFoundException('Customer retention not found');
    }

    return retention;
  }

  async update(id: string, data: UpdateCustomerRetentionDto) {
    await this.findOne(id);

    return this.prisma.customerRetention.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });
  }

  async deactivate(id: string, removedReason?: string) {
    await this.findOne(id);

    return this.prisma.customerRetention.update({
      where: { id },
      data: {
        isChatActive: false,
        removedReason,
      },
      include: this.includeRelations(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.customerRetention.delete({
      where: { id },
    });

    return { message: 'Customer retention deleted successfully' };
  }

  private includeRelations() {
    return {
      provider: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              mobileNumber: true,
              role: true,
              status: true,
            },
          },
        },
      },
      customer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              mobileNumber: true,
              role: true,
              status: true,
            },
          },
        },
      },
    };
  }

  private async assertProvider(providerId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
      select: { id: true },
    });

    if (!provider) {
      throw new BadRequestException('Provider profile not found');
    }
  }

  private async assertCustomer(customerId: string) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new BadRequestException('Customer profile not found');
    }
  }
}
