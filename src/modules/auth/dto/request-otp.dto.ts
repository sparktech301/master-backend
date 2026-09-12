import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({
    example: '+8801700000000',
    description: 'User phone number with country code',
  })
  @IsString()
  @IsPhoneNumber()
  phoneNumber!: string;
}
