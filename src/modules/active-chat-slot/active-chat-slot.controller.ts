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
import {
  CreateActiveChatSlotDto,
  UpdateActiveChatSlotDto,
} from './dto/active-chat-slot.dto';
import { ActiveChatSlotService } from './active-chat-slot.service';

@ApiTags('Active Chat Slot')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('active-chat-slot')
export class ActiveChatSlotController {
  constructor(private readonly activeChatSlotService: ActiveChatSlotService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create active chat slot' })
  create(@Body() data: CreateActiveChatSlotDto) {
    return this.activeChatSlotService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active chat slots' })
  findAll() {
    return this.activeChatSlotService.findAll();
  }

  @Get('provider/:providerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get chat slots by provider profile' })
  findByProvider(@Param('providerId', new ParseUUIDPipe()) providerId: string) {
    return this.activeChatSlotService.findByProvider(providerId);
  }

  @Get('customer/:customerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get chat slots by customer profile' })
  findByCustomer(@Param('customerId', new ParseUUIDPipe()) customerId: string) {
    return this.activeChatSlotService.findByCustomer(customerId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get active chat slot by id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.activeChatSlotService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update active chat slot' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateActiveChatSlotDto,
  ) {
    return this.activeChatSlotService.update(id, data);
  }

  @Patch(':id/close')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close active chat slot' })
  close(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.activeChatSlotService.close(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete active chat slot' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.activeChatSlotService.remove(id);
  }
}
