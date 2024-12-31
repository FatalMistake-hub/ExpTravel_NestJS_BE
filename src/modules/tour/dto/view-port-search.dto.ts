import { IsString } from 'class-validator';

export class ViewPortSearchDto {
  @IsString()
  northEastLat: string;

  @IsString()
  northEastLng: string;

  @IsString()
  southWestLat: string;

  @IsString()
  southWestLng: string;
}
