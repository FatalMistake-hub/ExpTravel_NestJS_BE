// update-tour.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { TourCreateDto } from './create-tour.dto';

export class TourUpdateDto extends PartialType(TourCreateDto) {}
