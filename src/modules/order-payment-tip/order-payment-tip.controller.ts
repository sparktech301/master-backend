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
  CreateOrderPaymentTipDto,
  UpdateOrderPaymentTipDto,
} from './dto/order-payment-tip.dto';
import { OrderPaymentTipService } from './order-payment-tip.service';

@ApiTags('Order Payment And Tip')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('order-payment-tip')
export class OrderPaymentTipController {
  constructor(
    private readonly orderPaymentTipService: OrderPaymentTipService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update order payment and tip' })
  create(@Body() data: CreateOrderPaymentTipDto) {
    return this.orderPaymentTipService.create(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all order payments and tips' })
  findAll() {
    return this.orderPaymentTipService.findAll();
  }

  @Get('order/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment and tip by order' })
  findByOrder(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return this.orderPaymentTipService.findByOrder(orderId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get order payment and tip by id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderPaymentTipService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update order payment and tip' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateOrderPaymentTipDto,
  ) {
    return this.orderPaymentTipService.update(id, data);
  }

  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm order payment and tip' })
  confirm(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderPaymentTipService.confirm(id);
  }

  @Patch(':id/dispute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dispute order payment and tip' })
  dispute(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateOrderPaymentTipDto,
  ) {
    return this.orderPaymentTipService.dispute(id, data.disputeReason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete order payment and tip' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderPaymentTipService.remove(id);
  }
}
