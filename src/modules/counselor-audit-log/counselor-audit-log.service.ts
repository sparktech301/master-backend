import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateCounselorAuditLogDto,
  UpdateCounselorAuditLogDto,
} from './dto/counselor-audit-log.dto';

@Injectable()
export class CounselorAuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCounselorAuditLogDto) {
    await this.assertCounselor(data.counselorId);
    await this.assertSession(data.sessionId);

    return this.prisma.counselorAuditLog.create({
      data,
      include: this.includeRelations(),
    });
  }

  findAll() {
    return this.prisma.counselorAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  findByCounselor(counselorId: string) {
    return this.prisma.counselorAuditLog.findMany({
      where: { counselorId },
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  findBySession(sessionId: string) {
    return this.prisma.counselorAuditLog.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      include: this.includeRelations(),
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.counselorAuditLog.findUnique({
      where: { id },
      include: this.includeRelations(),
    });
    if (!log) throw new NotFoundException('Counselor audit log not found');
    return log;
  }

  async update(id: string, data: UpdateCounselorAuditLogDto) {
    await this.findOne(id);
    return this.prisma.counselorAuditLog.update({
      where: { id },
      data,
      include: this.includeRelations(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.counselorAuditLog.delete({ where: { id } });
    return { message: 'Counselor audit log deleted successfully' };
  }

  private includeRelations() {
    return {
      counselor: { include: { user: true } },
      session: true,
    };
  }

  private async assertCounselor(counselorId: string) {
    const counselor = await this.prisma.counselorProfile.findUnique({
      where: { id: counselorId },
      select: { id: true },
    });
    if (!counselor)
      throw new BadRequestException('Counselor profile not found');
  }

  private async assertSession(sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });
    if (!session) throw new BadRequestException('Chat session not found');
  }
}
