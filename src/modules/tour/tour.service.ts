import { createMap, Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NativeUserRepository } from 'src/repository/user.repository';
import { divideTimeRange, getDateRange } from 'src/utils';
import { DayBookStatusEnum } from 'src/utils/enum';
import { Repository } from 'typeorm';
import { NativeTourRepository } from '../../repository/tour.repository';
import { DayBookService } from '../dayBook/dayBook.service';
import { DayBookCreateDto } from '../dayBook/dto/day-book-create.dto';
import { ImageDto } from '../imageDetail/dto/image.dto';
import { ImageDetail } from '../imageDetail/imageDetail.entity';
import { ImageDetailsService } from '../imageDetail/ImageDetail.service';
import { TimeBookDetailDto } from '../time-book-detail/dto/time-book-detail.dto';
import { TimeBookEndDto } from '../time-book-detail/dto/time-book-end.dto';
import { TimeBookStartDto } from '../time-book-detail/dto/time-book-start.dto';
import { TimeBookDetailService } from '../time-book-detail/timeBookDetail.service';
import { UserViewDto } from '../users/dto/user-view.dto';
import { UsersService } from '../users/users.service';
import { TourCreateDto } from './dto/create-tour.dto';
import { TourResponseDto } from './dto/response-tour.dto';
import { TourDetailDto } from './dto/tour-detail.dto';
import { TourViewDto } from './dto/tour-view.dto';
import { TourUpdateDto } from './dto/update-tour.dto';
import { Tour } from './tour.entity';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ToursService extends AutomapperProfile {
  constructor(
    @InjectRepository(ImageDetail)
    @InjectRepository(NativeTourRepository)
    @InjectRepository(NativeUserRepository)
    private readonly imageDetailRepository: Repository<ImageDetail>,
    private readonly nativeTourRepository: NativeTourRepository,
    private readonly nativeUserRepository: NativeUserRepository,
    private readonly imageDetailService: ImageDetailsService,
    private readonly dayBookService: DayBookService,
    private readonly userService: UsersService,
    private readonly timeBookDetailService: TimeBookDetailService,
    @InjectMapper() mapper: Mapper, // // private tourRepository: Repository<Tour>
    @InjectQueue('time-book-queue') private timeBookQueue: Queue
  ) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Tour, TourCreateDto);
      createMap(mapper, TourCreateDto, Tour);
    };
  }
  async createTour(
    tourDto: TourCreateDto,
    userId: string,
  ): Promise<TourCreateDto> {
    const tourList = await this.nativeTourRepository.getAllTourByUserId(userId);

    if (tourList.length === 0) {
      // Assuming there's a UserService with an updateRole method
      await this.nativeUserRepository.updateRole(userId, 'OWNER');
    }

    const tourId = Math.abs(
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    );

    // START TIME AND END TIME
    const startTime = `${tourDto.timeBookStart.hour}:${tourDto.timeBookStart.minutes}`;
    const endTime = `${tourDto.timeBookEnd.hour}:${tourDto.timeBookEnd.minutes}`;

    const newTour = this.nativeTourRepository.create({
      tour_id: tourId,
      user_id: userId,
      categories: tourDto.categories,
      city: tourDto.city,
      destination: tourDto.destination,
      rating: tourDto.rating,
      latitude: parseFloat(tourDto.latitude),
      longitude: parseFloat(tourDto.longitude),
      title: tourDto.title,
      working: tourDto.working,
      image_main: tourDto.imageMain,
      check_in: tourDto.checkIn,
      check_out: tourDto.checkOut,
      time_slot_length: tourDto.timeSlotLength,
      price_one_person: tourDto.priceOnePerson,
      timeBookStart: startTime,
      timeBookEnd: endTime,
      ...this.mapper.map(tourDto, TourCreateDto, Tour),
      destination_description: tourDto.destinationDescription,
    });
    await this.nativeTourRepository.save(newTour);

    // IMAGE PROCESS
    const imageDtos: ImageDto[] = tourDto.imageDtoList.map((item) => ({
      imageId: item.imageId,
      tourId,
      link: item.link,
    }));

    await this.timeBookQueue.add('create-time-book-detail', { tourDto, tourId });

    await this.imageDetailService.createImageDetailForTour(imageDtos);

    // DATE PROCESS
    // const dateTimes = getDateRange(tourDto.startDay, tourDto.endDay);
    // const dayBookCreateDtos: DayBookCreateDto[] = dateTimes.map((date) => ({
    //   dateName: date,
    //   tourId,
    //   status: DayBookStatusEnum.AVAILABLE,
    // }));
    // for (const dateBook of dayBookCreateDtos) {
    //   const dayBook = await this.dayBookService.createDayBooking(dateBook);
    //   //   // TIME PROCESS
    //   const localTimes = divideTimeRange(
    //     tourDto.timeBookStart,
    //     tourDto.timeBookEnd,
    //     tourDto.timeSlotLength,
    //   );

    //   const timeBookDetailDtos: TimeBookDetailDto[] = [];
    //   for (let i = 0; i < localTimes.length - 1; i++) {
    //     timeBookDetailDtos.push({
    //       dayBookId: dayBook.day_book_id,
    //       startTime: localTimes[i].hour + ':' + localTimes[i].minutes,
    //       endTime: localTimes[i + 1].hour + ':' + localTimes[i + 1].minutes,
    //       isPayment: false,
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
    const tourList = await this.nativeTourRepository.getAllTour(
      (pageNo - 1) * pageSize,
      pageSize,
    );
    const totalElements = tourList.length;
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

  async getTourViewPort(
    northEastLat: string,
    northEastLng: string,
    southWestLat: string,
    southWestLng: string,
    pageSize: number,
    pageNo: number,
  ) {
    const offset = (pageNo - 1) * pageSize;

    const tours = await this.nativeTourRepository.getTourViewPort(
      parseFloat(northEastLat),
      parseFloat(southWestLat),
      parseFloat(northEastLng),
      parseFloat(southWestLng),
      offset,
      pageSize,
    );
    const tourDtos: TourViewDto[] = await this.mappingTourList(tours);

    return {
      content: tourDtos,
      pageNo,
      pageSize,
      totalElements: tours.length,
      totalPages: Math.ceil(tours.length / pageSize),
    };
  }

  async getTourDetail(tourId: number): Promise<TourDetailDto> {
    const tour = await this.nativeTourRepository.findOne({
      where: { tour_id: tourId },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found !!');
    }

    const imageDetails = await this.imageDetailRepository.find({
      where: { tour_id: tourId },
    });
    // const avgRatingTour = await this.reviewService.calAvgRatingReviewForTour(
    //   tour.tourId,
    // );
    const user = await this.userService.getUserByTourId(tourId);

    if (!user) {
      throw new NotFoundException('User not found for the tour !!');
    }

    const userViewDto: UserViewDto = {
      userId: user.user_id,
      role: user.role,
      address: user.address,
      language: user.language,
      userName: user.user_name,
      userEmail: user.user_email,
      urlImage: user.url_image,
      description: user.description,
      phoneNumber: user.phone_number,
      isEnabled: user.is_enabled,
    };

    const timeBookStart: TimeBookStartDto = tour.timeBookStart
      ? { hour: tour.timeBookStart.hour, minutes: tour.timeBookStart.minute }
      : null;

    const timeBookEnd: TimeBookEndDto = tour.timeBookEnd
      ? { hour: tour.timeBookEnd.hour, minutes: tour.timeBookEnd.minute }
      : null;

    const tourDetailDto: TourDetailDto = {
      tourId: tour.tour_id,
      title: tour.title,
      rating: tour.rating,
      city: tour.city,
      priceOnePerson: tour.price_one_person,
      imageMain: tour.image_main,
      working: tour.working,
      latitude: tour.latitude,
      longitude: tour.longitude,
      destination: tour.destination,
      destinationDescription: tour.destination_description,
      images: imageDetails.map((image) => ({
        imageId: image.image_id,
        link: image.link,
        tourId: image.tour_id,
      })),
      // avgRating: avgRatingTour,
      userId: tour.user_id,
      timeSlotLength: tour.time_slot_length,
      isDeleted: tour.is_deleted,
      user: userViewDto,
      timeBookStart,
      timeBookEnd,
    };

    return tourDetailDto;
  }
  async updateTourByField(
    id: number,
    updateTourDto: TourUpdateDto,
  ): Promise<Tour> {
    const tour = await this.nativeTourRepository.findOne({
      where: { tour_id: id },
    });
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
    // Merge the existing tour with the updated fields
    const updatedTour = this.nativeTourRepository.merge(tour, {
      ...updateTourDto,
      latitude: parseFloat(updateTourDto.latitude),
      longitude: parseFloat(updateTourDto.longitude),
    });
    return this.nativeTourRepository.save(updatedTour);
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
      tourViewDto.destinationDescription =
        tour.destinationDescription || tour.destination_description;
      tourViewDto.userId = tour.userId || tour.user_id;
      tourViewDto.imageMain = tour.imageMain || tour.image_main;
      tourViewDto.timeSlotLength = tour.timeSlotLength || tour.time_slot_length;
      tourViewDto.categoryId =
        tour.categories?.[0].categoryId || tour.category_id;
      tourViewDto.categoryName =
        tour.categories?.[0].categoryName || tour.category_name;
      tourViewDto.isDeleted = tour.isDeleted || tour.is_deleted;
      tourViewDtos.push(tourViewDto);
    }
    return tourViewDtos;
  }
  async deleteByTourId(tourId: number): Promise<void> {
    const tour = await this.nativeTourRepository.findOne({
      where: { tour_id: tourId },
    });
    if (tour.is_deleted) {
      throw new NotFoundException(`Tour with ID ${tourId} is already deleted`);
    }
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${tourId} not found`);
    }
    tour.is_deleted = true;
    await this.nativeTourRepository.save(tour);
  }
}
