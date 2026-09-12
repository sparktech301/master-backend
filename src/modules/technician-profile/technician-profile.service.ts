import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTechnicianProfileDto,
  UpdateTechnicianProfileDto,
} from './dto/technician-profile.dto';

@Injectable()
export class TechnicianProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createMine(userId: string, data: CreateTechnicianProfileDto) {
    await this.assertProviderAgency(data.providerAgencyId);

    return this.prisma.technicianProfile.upsert({
      where: { userId },
      update: {
        providerAgencyId: data.providerAgencyId,
        invitedAt: data.invitedAt,
        currentLat: data.currentLat,
        currentLong: data.currentLong,
      },
      create: {
        userId,
        providerAgencyId: data.providerAgencyId,
        invitedAt: data.invitedAt,
        currentLat: data.currentLat,
        currentLong: data.currentLong,
      },
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
        providerAgency: true,
      },
    });
  }

  findMine(userId: string) {
    return this.prisma.technicianProfile.findUnique({
      where: { userId },
      include: {
        providerAgency: true,
      },
    });
  }

  async findOne(id: string) {
    const profile = await this.prisma.technicianProfile.findUnique({
      where: { id },
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
        providerAgency: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Technician profile not found');
    }

    return profile;
  }

  async updateMine(userId: string, data: UpdateTechnicianProfileDto) {
    const existing = await this.prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Technician profile not found');
    }

    await this.assertProviderAgency(data.providerAgencyId);

    return this.prisma.technicianProfile.update({
      where: { userId },
      data: {
        providerAgencyId: data.providerAgencyId,
        invitedAt: data.invitedAt,
        lastLoginAt: data.lastLoginAt,
        currentLat: data.currentLat,
        currentLong: data.currentLong,
      },
      include: {
        providerAgency: true,
      },
    });
  }

  async removeMine(userId: string) {
    const existing = await this.prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Technician profile not found');
    }

    await this.prisma.technicianProfile.delete({
      where: { userId },
    });

    return { message: 'Technician profile deleted successfully' };
  }

  async assertOwner(userId: string, profileId: string) {
    const profile = await this.prisma.technicianProfile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });

    if (!profile) {
      throw new NotFoundException('Technician profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('Technician profile access denied');
    }
  }

  private async assertProviderAgency(providerAgencyId?: string) {
    if (!providerAgencyId) return;

    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerAgencyId },
      select: { id: true },
    });

    if (!provider) {
      throw new BadRequestException('Provider agency not found');
    }
  }
}
