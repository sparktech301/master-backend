import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from './dto/user-address.dto';

@Injectable()
export class UserAddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateUserAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.userAddress.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.userAddress.create({
        data: {
          userId,
          addressText: data.addressText,
          latitude: data.latitude,
          longitude: data.longitude,
          isDefault: data.isDefault ?? false,
        },
      });
    });
  }

  findMine(userId: string) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.userAddress.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('Address access denied');
    }

    return address;
  }

  async update(userId: string, id: string, data: UpdateUserAddressDto) {
    await this.findOne(userId, id);

    return this.prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.userAddress.updateMany({
          where: { userId, isDefault: true, NOT: { id } },
          data: { isDefault: false },
        });
      }

      return tx.userAddress.update({
        where: { id },
        data,
      });
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.userAddress.delete({
      where: { id },
    });

    return { message: 'Address deleted successfully' };
  }
}
