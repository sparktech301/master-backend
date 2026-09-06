import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import slugify from 'slugify';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const slug = data.slug || slugify(data.name, { lower: true, strict: true });
    return this.prisma.category.create({
      data: { ...data, slug },
    });
  }

  async getAllCategory() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { services: true } } },
    });
  }

  async getSingleCategory(id: string, slug: string) {
    return this.prisma.category.findUnique({
      where: { id, slug },
    });
  }

  async updateSingleCategory(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteSingleCategory(id:string){
    return this.prisma.category.update({
      where:{
        id
      },
      data:{
        isDeleted:true
      }
    })
  }

  async createService(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  async getAllServices() {
    return this.prisma.service.findMany();
  }

  async getSingleService(id: string) {
    return this.prisma.service.findUnique({
      where: {
        id,
      },
    });
  }

  async updateSingleService(id: string, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async deleteSingleService(id:string){
    return this.prisma.service.update({
      where:{
        id
      },
      data:{
        isDeleted:true
      }
    })
  }
}
