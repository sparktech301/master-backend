import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.ACCEPTED })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.PARTIAL })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}

export class UpdateOrderDto extends UpdateOrderStatusDto {
  @ApiPropertyOptional({
    format: 'uuid',
    example: 'c1b5f10e-656a-4d4f-8f63-7c5d60fb3d5d',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @ApiPropertyOptional({ example: 1200, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ example: 120, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  adminCommission?: number;

  @ApiPropertyOptional({ example: 250, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalPrice?: number;

  @ApiPropertyOptional({ example: 700, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  advancePaid?: number;
}
