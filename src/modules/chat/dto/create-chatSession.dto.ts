import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChatSessionDto {
  @ApiProperty({
    format: 'uuid',
    example: '4d2d7c40-9f10-4a94-9c44-4cc3fbb81f67',
  })
  @IsUUID()
  @IsNotEmpty()
  serviceId!: string;

  @ApiProperty({
    format: 'uuid',
    example: '87af2a7b-8d14-4f6e-a2d9-469d5f51855e',
  })
  @IsUUID()
  @IsNotEmpty()
  customerProfileId!: string;
}
