import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatAuditLogDto } from './dto/chat-audit-log.dto';

@Injectable()
export class ChatAuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateChatAuditLogDto) {
    await this.assertSession(data.sessionId);
    await this.assertSender(data.senderId);

    return this.prisma.chatAuditLog.create({
      data: {
        sessionId: data.sessionId,
        senderId: data.senderId,
        flowType: data.flowType,
        messageType: data.messageType,
        messagePayload: data.messagePayload as Prisma.InputJsonValue,
      },
      include: { session: true, sender: true },
    });
  }

  findAll() {
    return this.prisma.chatAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { session: true, sender: true },
    });
  }

  findBySession(sessionId: string) {
    return this.prisma.chatAuditLog.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      include: { sender: true },
    });
  }

  async findOne(id: bigint) {
    const log = await this.prisma.chatAuditLog.findUnique({
      where: { id },
      include: { session: true, sender: true },
    });
    if (!log) throw new NotFoundException('Chat audit log not found');
    return log;
  }

  async remove(id: bigint) {
    await this.findOne(id);
    await this.prisma.chatAuditLog.delete({ where: { id } });
    return { message: 'Chat audit log deleted successfully' };
  }

  private async assertSession(sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });
    if (!session) throw new BadRequestException('Chat session not found');
  }

  private async assertSender(senderId?: string) {
    if (!senderId) return;
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true },
    });
    if (!sender) throw new BadRequestException('Sender not found');
  }
}
