import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './tour.entity';
import { NativeTourRepository } from './repository/tour.repository';
import { ImageDetailsService } from '../imageDetail/ImageDetail.service';
import { TourCreateDto } from './dto/create-tour.dto';
import { ImageDto } from '../imageDetail/dto/image.dto';
import { UsersService } from '../users/users.service';
import { TourViewDto } from './dto/tour-view.dto';
import { TourResponseDto } from './dto/response-tour.dto';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(NativeTourRepository)
    private readonly nativeTourRepository: NativeTourRepository,
    private readonly imageDetailService: ImageDetailsService, // private readonly dayBookService: DayBookService, // private readonly userService: UsersService, // private tourRepository: Repository<Tour> // private readonly timeBookDetailService: TimeBookDetailService,
  ) {}
  async createTour(
    tourDto: TourCreateDto,
    userId: string,
  ): Promise<TourCreateDto> {
    const tourList = await this.nativeTourRepository.getAllTourByUserId(userId);

    if (tourList.length === 0) {
      // Assuming there's a UserService with an updateRole method
      // await this.userService.updateRole(userId, 'OWNER');
    }

    const tourId = Math.abs(
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    );

    // START TIME AND END TIME
    // const startTime = `${tourDto.timeBookStart.hour}:${tourDto.timeBookStart.minutes}`;
    // const endTime = `${tourDto.timeBookEnd.hour}:${tourDto.timeBookEnd.minutes}`;
    console.log(tourDto, tourId, userId);
    const newTour = this.nativeTourRepository.create({
      tourId,
      userId,
      categories: tourDto.categories,
      city: tourDto.city,
      destination: tourDto.destination,
      destinationDescription: tourDto.destinationDescription,
      rating: tourDto.rating,
      latitude: parseFloat(tourDto.latitude),
      longitude: parseFloat(tourDto.longitude),
      title: tourDto.title,
      working: tourDto.working,
      imageMain: tourDto.imageMain,
      checkIn: tourDto.checkIn,
      checkOut: tourDto.checkOut,
      timeSlotLength: tourDto.timeSlotLength,
      // priceOnePerson: parseFloat(tourDto.priceOnePerson),
      priceOnePerson: tourDto.priceOnePerson,
      // timeBookStart: startTime,
      // timeBookEnd: endTime,
    });

    await this.nativeTourRepository.save(newTour);

    // IMAGE PROCESS
    const imageDtos: ImageDto[] = tourDto.imageDtoList.map((item) => ({
      imageId: item.imageId,
      tourId,
      link: item.link,
    }));
    await this.imageDetailService.createImageDetailForTour(imageDtos);

    // DATE PROCESS
    // const dateTimes = getDateRange(tourDto.startDay, tourDto.endDay);
    // const dateBookCreateDtos: DateBookCreateDto[] = dateTimes.map((date) => ({
    //   dateName: date,
    //   tourId,
    // }));

    // for (const dateBook of dateBookCreateDtos) {
    //   const dayBook = await this.dayBookService.createDayBooking(dateBook);

    //   // TIME PROCESS
    //   const localTimes = divideFrameTime(
    //     tourDto.timeBookStart,
    //     tourDto.timeBookEnd,
    //     tourDto.timeSlotLength,
    //   );

    //   const timeBookDetailDtos: TimeBookDetailDto[] = [];
    //   for (let i = 0; i < localTimes.length - 1; i++) {
    //     timeBookDetailDtos.push({
    //       dayBookId: dayBook.id,
    //       startTime: localTimes[i],
    //       endTime: localTimes[i + 1],
    //     });
    //   }

    //   for (const timeBookDetail of timeBookDetailDtos) {
    //     await this.timeBookDetailService.createTimeBookDetail(timeBookDetail);
    //   }
    // }

    return tourDto;
  }
  async getAll(pageNo: number, pageSize: number): Promise<TourResponseDto> {
    // Pagination
    const [tourList, totalElements] =
      await this.nativeTourRepository.findAndCount({
        take: pageSize,
        skip: (pageNo - 1) * pageSize,
        order: { createdAt: 'DESC' }, // Assuming you have a `createdAt` field
        relations: ['categories'],
      });
    console.log(tourList, totalElements);
    // Prepare the response
    const tourViewDtos: TourViewDto[] = await this.mappingTourList(tourList);

    // Prepare the final response
    const totalPages = Math.ceil(totalElements / pageSize);
    return {
      content: tourViewDtos,
      pageNo: pageNo,
      pageSize: pageSize,
      totalElements: totalElements,
      totalPages: totalPages,
    };
  }

  async getTourByCategoryName(
    categoryName: string,
    pageNo: number,
    pageSize: number,
    northEastLat: string,
    northEastLng: string,
    southWestLat: string,
    southWestLng: string,
  ) {
    const offset = (pageNo - 1) * pageSize;

    const tours = await this.nativeTourRepository.findTourByCategoryName(
      categoryName,
      parseFloat(northEastLat),
      parseFloat(southWestLat),
      parseFloat(northEastLng),
      parseFloat(southWestLng),
      offset,
      pageSize,
    );
    console.log(tours, typeof tours);
    const tourDtos: TourViewDto[] = await this.mappingTourList(tours);

    return {
      content: tourDtos,
      pageNo,
      pageSize,
      totalElements: tours.length,
      totalPages: Math.ceil(tours.length / pageSize),
    };
  }
  async mappingTourList(tourList?: Tour[]): Promise<TourViewDto[]> {
    const tourViewDtos: TourViewDto[] = [];
    if (!tourList) {
      return tourViewDtos;
    }
    for (const tour of tourList) {
      const tourViewDto = new TourViewDto();
      tourViewDto.tourId = tour.tourId || tour.tour_id;
      tourViewDto.title = tour.title;
      tourViewDto.rating = tour.rating;
      tourViewDto.city = tour.city;
      tourViewDto.priceOnePerson = tour.priceOnePerson || tour.price_one_person;
      tourViewDto.working = tour.working;
      tourViewDto.latitude = tour.latitude;
      tourViewDto.longitude = tour.longitude;
      tourViewDto.destination = tour.destination;
      tourViewDto.destinationDescription = tour.destinationDescription || tour.destination_description;
      tourViewDto.userId = tour.userId || tour.user_id;
      tourViewDto.imageMain = tour.imageMain || tour.image_main;
      tourViewDto.timeSlotLength = tour.timeSlotLength || tour.time_slot_length;
      tourViewDto.categoryId = tour.categories?.[0].categoryId || tour.category_id;
      tourViewDto.categoryName = tour.categories?.[0].categoryName || tour.category_name;
      tourViewDto.isDeleted = tour.isDeleted || tour.is_deleted;
      tourViewDtos.push(tourViewDto);
    }
    return tourViewDtos;
  }
}
