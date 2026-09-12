import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChatAuditLogController } from './chat-audit-log.controller';
import { ChatAuditLogService } from './chat-audit-log.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatAuditLogController],
  providers: [ChatAuditLogService],
})
export class ChatAuditLogModule {}
