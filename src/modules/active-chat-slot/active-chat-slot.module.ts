import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActiveChatSlotController } from './active-chat-slot.controller';
import { ActiveChatSlotService } from './active-chat-slot.service';

@Module({
  imports: [PrismaModule],
  controllers: [ActiveChatSlotController],
  providers: [ActiveChatSlotService],
  exports: [ActiveChatSlotService],
})
export class ActiveChatSlotModule {}
