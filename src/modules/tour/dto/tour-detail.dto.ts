import { ImageViewDto } from "src/modules/imageDetail/dto/image-view.dto";
import { TimeBookEndDto } from "src/modules/timeBookDetail/dto/time-book-end.dto";
import { TimeBookStartDto } from "src/modules/timeBookDetail/dto/time-book-start.dto";
import { UserViewDto } from "src/modules/users/dto/user-view.dto";

export class TourDetailDto {
  tourId: number;

  title: string;

  rating: number;

  city: string;

  priceOnePerson: number;

  imageMain: string;

  working: string;

  latitude: number;

  longitude: number;

  destination: string;

  destinationDescription: string;

  timeSlotLength: number;

  // avgRating: number;

  isDeleted: boolean;

  images: ImageViewDto[];

  userId: string;

  timeBookStart: TimeBookStartDto;

  timeBookEnd: TimeBookEndDto;

  user: UserViewDto;
}
