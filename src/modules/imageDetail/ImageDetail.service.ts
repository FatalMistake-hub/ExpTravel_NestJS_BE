import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageDetail } from './imageDetail.entity';
import { ImageDto } from './dto/image.dto';
import { ImageViewDto } from './dto/image-view.dto';

@Injectable()
export class ImageDetailsService {
  constructor(
    @InjectRepository(ImageDetail)
    private imageRepository: Repository<ImageDetail>, // 1.
  ) {}
  async createImageDetailForTour(imageDtos: ImageDto[]): Promise<ImageDto[]> {
    // Create a list of ImageDetail entities from the provided DTOs
    const imageDetailEntities = imageDtos.map((imageDto) => {
      const imageDetail = new ImageDetail();
      imageDetail.link = imageDto.link;
      imageDetail.tourId = imageDto.tourId;
      return imageDetail;
    });
  
    // Save the entities in bulk to the database
    const savedImages = await this.imageRepository.save(imageDetailEntities);
  
    // Map the saved entities back to DTOs for returning
    return savedImages.map((imageDetail) => ({
      imageId: imageDetail.imageId,
      link: imageDetail.link,
      tourId: imageDetail.tourId,
    }));
  }

  /**
   * Deletes an image by its ID.
   * @param id UUID of the image to be deleted.
   */
  async deleteByImageId(id: string): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { imageId: id },
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    await this.imageRepository.delete(id);
  }

  /**
   * Updates an image by its ID.
   * @param imageDto Image DTO with updated information.
   * @param id UUID of the image to update.
   * @returns Updated Image DTO.
   */
  async updateByImageId(imageDto: ImageDto, id: string): Promise<ImageDto> {
    const existingImage = await this.imageRepository.findOne({
      where: { imageId: id },
    });

    if (existingImage) {
      existingImage.link = imageDto.link;
      const updatedImage = await this.imageRepository.save(existingImage);
      return {
        imageId: updatedImage.imageId,
        link: updatedImage.link,
        tourId: updatedImage.tourId,
      };
    } else {
      const newImage = this.imageRepository.create({
        ...imageDto,
        imageId: id,
      });
      const savedImage = await this.imageRepository.save(newImage);
      return {
        imageId: savedImage.imageId,
        link: savedImage.link,
        tourId: savedImage.tourId,
      };
    }
  }

  /**
   * Retrieves all images from the database.
   * @returns List of ImageView DTOs.
   */
  async getAllImage(): Promise<ImageViewDto[]> {
    const imageDetails = await this.imageRepository.find();
    return imageDetails.map((imageDetail) => ({
      imageId: imageDetail.imageId,
      link: imageDetail.link,
      tourId: imageDetail.tourId,
    }));
  }
}
