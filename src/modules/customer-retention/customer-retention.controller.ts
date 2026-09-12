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
  CreateCustomerRetentionDto,
  UpdateCustomerRetentionDto,
} from './dto/customer-retention.dto';
import { CustomerRetentionService } from './customer-retention.service';

@ApiTags('Customer Retention')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('customer-retention')
export class CustomerRetentionController {
  constructor(
    private readonly customerRetentionService: CustomerRetentionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or reactivate customer retention' })
  create(@Body() data: CreateCustomerRetentionDto) {
    return this.customerRetentionService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all customer retentions' })
  findAll() {
    return this.customerRetentionService.findAll();
  }

  @Get('provider/:providerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get customer retentions by provider profile' })
  findByProvider(@Param('providerId', new ParseUUIDPipe()) providerId: string) {
    return this.customerRetentionService.findByProvider(providerId);
  }

  @Get('customer/:customerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get customer retentions by customer profile' })
  findByCustomer(@Param('customerId', new ParseUUIDPipe()) customerId: string) {
    return this.customerRetentionService.findByCustomer(customerId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get customer retention by id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.customerRetentionService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update customer retention' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateCustomerRetentionDto,
  ) {
    return this.customerRetentionService.update(id, data);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate customer retention' })
  deactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateCustomerRetentionDto,
  ) {
    return this.customerRetentionService.deactivate(id, data.removedReason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete customer retention' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.customerRetentionService.remove(id);
  }
}
