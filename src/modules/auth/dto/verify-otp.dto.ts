import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsPhoneNumber()
  phoneNumber!: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits long' })
  code!: string;
}
