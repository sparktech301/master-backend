import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProviderKycDto,
  UpdateProviderKycDto,
  UpdateProviderKycStatusDto,
} from './dto/provider-kyc.dto';

@Injectable()
export class ProviderKycService {
  constructor(private readonly prisma: PrismaService) {}

  async createMine(userId: string, data: CreateProviderKycDto) {
    const provider = await this.getProviderProfileByUserId(userId);

    return this.prisma.providerKyc.upsert({
      where: { providerId: provider.id },
      update: {
        ...data,
        status: 'PENDING',
      },
      create: {
        providerId: provider.id,
        ...data,
      },
      include: {
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
      },
    });
  }

  async findMine(userId: string) {
    const provider = await this.getProviderProfileByUserId(userId);

    return this.prisma.providerKyc.findUnique({
      where: { providerId: provider.id },
      include: {
        provider: true,
      },
    });
  }

  async findOne(id: string) {
    const kyc = await this.prisma.providerKyc.findUnique({
      where: { id },
      include: {
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
      },
    });

    if (!kyc) {
      throw new NotFoundException('Provider KYC not found');
    }

    return kyc;
  }

  async updateMine(userId: string, data: UpdateProviderKycDto) {
    const provider = await this.getProviderProfileByUserId(userId);

    const existing = await this.prisma.providerKyc.findUnique({
      where: { providerId: provider.id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Provider KYC not found');
    }

    return this.prisma.providerKyc.update({
      where: { providerId: provider.id },
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  async updateStatus(id: string, data: UpdateProviderKycStatusDto) {
    await this.findOne(id);

    return this.prisma.providerKyc.update({
      where: { id },
      data: {
        status: data.status,
      },
    });
  }

  async removeMine(userId: string) {
    const provider = await this.getProviderProfileByUserId(userId);

    const existing = await this.prisma.providerKyc.findUnique({
      where: { providerId: provider.id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Provider KYC not found');
    }

    await this.prisma.providerKyc.delete({
      where: { providerId: provider.id },
    });

    return { message: 'Provider KYC deleted successfully' };
  }

  async assertOwner(userId: string, kycId: string) {
    const kyc = await this.prisma.providerKyc.findUnique({
      where: { id: kycId },
      select: {
        provider: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!kyc) {
      throw new NotFoundException('Provider KYC not found');
    }

    if (kyc.provider.userId !== userId) {
      throw new ForbiddenException('Provider KYC access denied');
    }
  }

  private async getProviderProfileByUserId(userId: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!provider) {
      throw new BadRequestException('Provider profile not found');
    }

    return provider;
  }
}
