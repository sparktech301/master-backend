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
  CreateProviderKycDto,
  UpdateProviderKycDto,
  UpdateProviderKycStatusDto,
} from './dto/provider-kyc.dto';
import { ProviderKycService } from './provider-kyc.service';

type AuthenticatedRequest = Request & { user: { id: string } };

@ApiTags('Provider KYC')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('provider-kyc')
export class ProviderKycController {
  constructor(private readonly providerKycService: ProviderKycService) {}

  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or resubmit my provider KYC' })
  createMine(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateProviderKycDto,
  ) {
    return this.providerKycService.createMine(req.user.id, data);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my provider KYC' })
  findMine(@Req() req: AuthenticatedRequest) {
    return this.providerKycService.findMine(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get provider KYC by id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.providerKycService.findOne(id);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update and resubmit my provider KYC' })
  updateMine(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProviderKycDto,
  ) {
    return this.providerKycService.updateMine(req.user.id, data);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update provider KYC status' })
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateProviderKycStatusDto,
  ) {
    return this.providerKycService.updateStatus(id, data);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete my provider KYC' })
  removeMine(@Req() req: AuthenticatedRequest) {
    return this.providerKycService.removeMine(req.user.id);
  }
}
