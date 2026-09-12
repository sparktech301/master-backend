import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateServiceRevisionDto,
  UpdateServiceRevisionDto,
} from './dto/service-revision.dto';

@Injectable()
export class ServiceRevisionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateServiceRevisionDto) {
    await this.assertOrder(data.orderId);

    return this.prisma.serviceRevision.create({
      data: {
        orderId: data.orderId,
        issueDescription: data.issueDescription,
        attachedImages: data.attachedImages ?? [],
        revisionStatus: data.revisionStatus,
        warrantyExpiresAt: data.warrantyExpiresAt,
      },
      include: { order: true },
    });
  }

  findAll() {
    return this.prisma.serviceRevision.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
  }

  findByOrder(orderId: string) {
    return this.prisma.serviceRevision.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
  }

  async findOne(id: string) {
    const revision = await this.prisma.serviceRevision.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!revision) throw new NotFoundException('Service revision not found');
    return revision;
  }

  async update(id: string, data: UpdateServiceRevisionDto) {
    await this.findOne(id);

    return this.prisma.serviceRevision.update({
      where: { id },
      data,
      include: { order: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.serviceRevision.delete({ where: { id } });
    return { message: 'Service revision deleted successfully' };
  }

  private async assertOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!order) throw new BadRequestException('Order not found');
  }
}
