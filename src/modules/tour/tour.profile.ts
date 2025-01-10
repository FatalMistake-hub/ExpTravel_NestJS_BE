// profiles/category.profile.ts
import { createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { ImageDetail } from '../imageDetail/imageDetail.entity';
import { CategoryDto } from '../category/dto/category.dto';
import { Tour } from './tour.entity';
import { TourCreateDto } from './dto/create-tour.dto';
import { Category } from '../category/category.entity';
import { ImageDto } from '../imageDetail/dto/image.dto';



@Injectable()
export class TourProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Tour, TourCreateDto);
      createMap(mapper, TourCreateDto, Tour);
      createMap(mapper, Category, CategoryDto);
      createMap(mapper, CategoryDto, Category);
      createMap(mapper, ImageDetail, ImageDto)
      createMap(mapper, ImageDto, ImageDetail)
    };
  }
}
