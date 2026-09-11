import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  serviceId!: string;

  @IsUUID()
  @IsNotEmpty()
  customerProfileId!: string;
}
