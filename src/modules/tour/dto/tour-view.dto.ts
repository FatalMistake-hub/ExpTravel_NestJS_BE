import { IsString, IsOptional, IsNumber, IsUUID, IsBoolean } from 'class-validator';

export class TourViewDto {
  @IsNumber()
  tourId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsString()
  city: string;

  @IsNumber()
  priceOnePerson: number;

  @IsString()
  imageMain: string;

  @IsString()
  working: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  destination: string;

  @IsString()
  destinationDescription: string;

  @IsNumber()
  timeSlotLength: number;

  @IsNumber()
  categoryId: number;

  @IsString()
  categoryName: string;

  @IsOptional()
  @IsNumber()
  avgRating?: number;

  @IsBoolean()
  isDeleted: boolean;

  @IsUUID()
  userId: string;
}
