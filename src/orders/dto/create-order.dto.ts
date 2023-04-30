import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  productIds: number[];
}
