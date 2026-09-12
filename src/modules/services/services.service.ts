import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const slug = data.slug || slugify(data.name, { lower: true, strict: true });

    const existingCategory = await this.prisma.serviceCategory.findFirst({
      where: {
        OR: [
          {
            name: data.name,
          },
          {
            slug: slug,
          },
        ],
      },
    });

    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    return this.prisma.serviceCategory.create({
      data: { ...data, slug },
    });
  }

  async getAllCategory() {
    return this.prisma.serviceCategory.findMany({
      where: { isActive: true, isDeleted: false },
      include: { _count: { select: { services: true } } },
    });
  }

  async getSingleCategory(identifier: string) {
    const category = await this.prisma.serviceCategory.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        isDeleted: false,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateSingleCategory(id: string, data: UpdateCategoryDto) {
    return this.prisma.serviceCategory.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteSingleCategory(id: string) {
    return this.prisma.serviceCategory.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async createService(data: CreateServiceDto) {
    console.log(data);

    return this.prisma.service.create({ data });
  }

  async getAllServices() {
    return this.prisma.service.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      include: {
        category: true,
      },
    });
  }

  async getSingleService(id: string) {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
        isActive: true,
        isDeleted: false,
      },
      include: {
        category: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async updateSingleService(id: string, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async deleteSingleService(id: string) {
    return this.prisma.service.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
