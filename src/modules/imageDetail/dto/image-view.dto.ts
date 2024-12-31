import { IsUUID, IsString } from 'class-validator';

export class ImageViewDto {
  @IsUUID()
  imageId: string;

  @IsString()
  link: string;
}
