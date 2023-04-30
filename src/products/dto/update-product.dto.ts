import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProductsDTO {
  @IsOptional()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  imageUrl: string;

  @IsOptional()
  price: string;
}
