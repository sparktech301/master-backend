import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConfirmationStatus, PaymentMode } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderPaymentTipDto {
  @ApiProperty({
    format: 'uuid',
    example: '6e7f4f75-d1dc-49eb-90ad-854d8fe363d0',
  })
  @IsUUID()
  orderId!: string;

  @ApiProperty({ enum: PaymentMode, example: PaymentMode.CASH })
  @IsEnum(PaymentMode)
  paymentMode!: PaymentMode;

  @ApiPropertyOptional({ example: 1000, minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceAmountPaid?: number;

  @ApiPropertyOptional({ example: 100, minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tipAmount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hasTip?: boolean;

  @ApiPropertyOptional({
    enum: ConfirmationStatus,
    example: ConfirmationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ConfirmationStatus)
  confirmationStatus?: ConfirmationStatus;

  @ApiPropertyOptional({ example: '2026-09-12T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  confirmationDeadline?: string;

  @ApiPropertyOptional({ example: '2026-09-12T17:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  customerConfirmedAt?: string;

  @ApiPropertyOptional({ example: 'Customer disputed the paid amount' })
  @IsOptional()
  @IsString()
  disputeReason?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  varianceFlag?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isGuestOrder?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  completedByPartner?: boolean;
}

export class UpdateOrderPaymentTipDto {
  @ApiPropertyOptional({ enum: PaymentMode, example: PaymentMode.BKASH })
  @IsOptional()
  @IsEnum(PaymentMode)
  paymentMode?: PaymentMode;

  @ApiPropertyOptional({ example: 1000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceAmountPaid?: number;

  @ApiPropertyOptional({ example: 100, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tipAmount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hasTip?: boolean;

  @ApiPropertyOptional({
    enum: ConfirmationStatus,
    example: ConfirmationStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(ConfirmationStatus)
  confirmationStatus?: ConfirmationStatus;

  @ApiPropertyOptional({ example: '2026-09-12T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  confirmationDeadline?: string;

  @ApiPropertyOptional({ example: '2026-09-12T17:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  customerConfirmedAt?: string;

  @ApiPropertyOptional({ example: 'Customer disputed the paid amount' })
  @IsOptional()
  @IsString()
  disputeReason?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  varianceFlag?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isGuestOrder?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  completedByPartner?: boolean;
}
