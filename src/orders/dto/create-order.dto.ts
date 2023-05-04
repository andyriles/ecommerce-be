import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsNotEmpty()
  customerPhoneNumber: string;

  @IsNotEmpty()
  productIds: number[];
}
