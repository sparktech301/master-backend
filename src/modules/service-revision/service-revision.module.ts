import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServiceRevisionController } from './service-revision.controller';
import { ServiceRevisionService } from './service-revision.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceRevisionController],
  providers: [ServiceRevisionService],
})
export class ServiceRevisionModule {}
