import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServiceAssigneeController } from './service-assignee.controller';
import { ServiceAssigneeService } from './service-assignee.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceAssigneeController],
  providers: [ServiceAssigneeService],
  exports: [ServiceAssigneeService],
})
export class ServiceAssigneeModule {}
