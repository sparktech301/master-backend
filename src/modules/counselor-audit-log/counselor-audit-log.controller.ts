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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CounselorAuditLogService } from './counselor-audit-log.service';
import {
  CreateCounselorAuditLogDto,
  UpdateCounselorAuditLogDto,
} from './dto/counselor-audit-log.dto';

@ApiTags('Counselor Audit Log')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('counselor-audit-log')
export class CounselorAuditLogController {
  constructor(
    private readonly counselorAuditLogService: CounselorAuditLogService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create counselor audit log' })
  create(@Body() data: CreateCounselorAuditLogDto) {
    return this.counselorAuditLogService.create(data);
  }

  @Get()
  findAll() {
    return this.counselorAuditLogService.findAll();
  }

  @Get('counselor/:counselorId')
  findByCounselor(
    @Param('counselorId', new ParseUUIDPipe()) counselorId: string,
  ) {
    return this.counselorAuditLogService.findByCounselor(counselorId);
  }

  @Get('session/:sessionId')
  findBySession(@Param('sessionId', new ParseUUIDPipe()) sessionId: string) {
    return this.counselorAuditLogService.findBySession(sessionId);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.counselorAuditLogService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateCounselorAuditLogDto,
  ) {
    return this.counselorAuditLogService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.counselorAuditLogService.remove(id);
  }
}
