import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TechnicianProfileController } from './technician-profile.controller';
import { TechnicianProfileService } from './technician-profile.service';

@Module({
  imports: [PrismaModule],
  controllers: [TechnicianProfileController],
  providers: [TechnicianProfileService],
  exports: [TechnicianProfileService],
})
export class TechnicianProfileModule {}
