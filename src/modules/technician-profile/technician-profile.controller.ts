import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateTechnicianProfileDto,
  UpdateTechnicianProfileDto,
} from './dto/technician-profile.dto';
import { TechnicianProfileService } from './technician-profile.service';

type AuthenticatedRequest = Request & { user: { id: string } };

@ApiTags('Technician Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('technician-profile')
export class TechnicianProfileController {
  constructor(
    private readonly technicianProfileService: TechnicianProfileService,
  ) {}

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update my technician profile' })
  createMine(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateTechnicianProfileDto,
  ) {
    return this.technicianProfileService.createMine(req.user.id, data);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my technician profile' })
  findMine(@Req() req: AuthenticatedRequest) {
    return this.technicianProfileService.findMine(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get technician profile by id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.technicianProfileService.findOne(id);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update my technician profile' })
  updateMine(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateTechnicianProfileDto,
  ) {
    return this.technicianProfileService.updateMine(req.user.id, data);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete my technician profile' })
  removeMine(@Req() req: AuthenticatedRequest) {
    return this.technicianProfileService.removeMine(req.user.id);
  }
}
