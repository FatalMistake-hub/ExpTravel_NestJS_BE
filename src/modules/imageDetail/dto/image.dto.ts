import { IsUUID, IsString, IsNumber } from 'class-validator';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
export class ImageDto {
  @IsUUID()
  imageId: string = uuidv4();

  @IsString()
  link: string;

  @IsNumber()
  tourId: number;
}
