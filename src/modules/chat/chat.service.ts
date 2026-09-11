import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageType, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateConversation(data: CreateConversationDto) {
    return this.prisma.conversation.upsert({
      where: {
        customerId_serviceId: {
          customerId: data.customerProfileId,
          serviceId: data.serviceId,
        },
      },
      update: {},
      create: {
        customerId: data.customerProfileId,
        serviceId: data.serviceId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }
  async addParticipant(conversationId: string, userId: string) {
    return this.prisma.chatParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      update: {
        isActive: true,
        leftAt: null,
      },
      create: {
        conversationId,
        userId,
        isActive: true,
      },
      include: {
        user: true,
      },
    });
  }

  async saveMessage(senderId: string, dto: SendMessageDto) {
    return this.prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.findUnique({
        where: {
          id: dto.conversationId,
        },
        select: {
          id: true,
        },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }

      const sender = await tx.user.findUnique({
        where: {
          id: senderId,
        },
        select: {
          role: true,
          status: true,
        },
      });

      if (!sender || sender.status !== 'ACTIVE') {
        throw new ForbiddenException('Sender is not allowed');
      }

      if (dto.type === MessageType.SYSTEM) {
        throw new ForbiddenException('SYSTEM messages cannot be sent by users');
      }

      if (dto.type === MessageType.OFFER && sender.role !== UserRole.PROVIDER) {
        throw new ForbiddenException('Only providers can send offers');
      }

      const messageType = dto.type ?? MessageType.TEXT;
      const text = dto.text?.trim();
      const fileUrl = dto.fileUrl?.trim();

      if (messageType === MessageType.TEXT && !text) {
        throw new BadRequestException('Text is required');
      }

      const fileTypes: MessageType[] = [
        MessageType.IMAGE,
        MessageType.VIDEO,
        MessageType.AUDIO,
        MessageType.FILE,
      ];

      if (fileTypes.includes(messageType) && !fileUrl) {
        throw new BadRequestException(
          `File URL is required for ${messageType} messages`,
        );
      }

      const message = await tx.message.create({
        data: {
          conversationId: dto.conversationId,
          senderId,
          text: dto.text,
          fileUrl: dto.fileUrl,
          type: dto.type,
          isSend: true,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      await tx.conversation.update({
        where: {
          id: dto.conversationId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return message;
    });
  }

  async getMessages(conversationId: string, limit = 50, offset = 0) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  }

  async leaveConversation(conversationId: string, userId: string) {
    return this.prisma.chatParticipant.updateMany({
      where: {
        conversationId,
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
        leftAt: new Date(),
      },
    });
  }
}
