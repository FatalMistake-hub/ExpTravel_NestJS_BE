import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsString()
  categoryName: string;

  @IsString()
  imageLink: string;
}
