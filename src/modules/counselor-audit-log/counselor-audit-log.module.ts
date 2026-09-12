import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CounselorAuditLogController } from './counselor-audit-log.controller';
import { CounselorAuditLogService } from './counselor-audit-log.service';

@Module({
  imports: [PrismaModule],
  controllers: [CounselorAuditLogController],
  providers: [CounselorAuditLogService],
})
export class CounselorAuditLogModule {}
