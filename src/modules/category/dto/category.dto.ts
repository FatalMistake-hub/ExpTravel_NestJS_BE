import { AutoMap } from '@automapper/classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  @AutoMap()
  @IsNumber()
  categoryId?: number;
  
  @AutoMap()
  @IsString()
  categoryName: string;
  
  @AutoMap()
  @IsString()
  imageLink: string;
}
