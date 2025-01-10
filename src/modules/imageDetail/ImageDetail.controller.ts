import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageDetailsService } from './ImageDetail.service';
import { ImageDto } from './dto/image.dto';
import { ImageViewDto } from './dto/image-view.dto';

// import { ChangePasswordResponse } from './response/change-password.response';

@Controller('image')
@ApiTags('Image')
export class ImageDetailController {
  constructor(private readonly imageDetailsService: ImageDetailsService) {}
  @Post('create')
  @ApiOperation({ summary: 'Create image details for a tour' })
  @ApiBody({ type: [ImageDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Images successfully created',
    type: [ImageDto],
  })
  async createImageDetailForTour(@Body() imageDtos: ImageDto[]): Promise<ImageDto[]> {
    return this.imageDetailsService.createImageDetailForTour(imageDtos);
  }

  @Delete('image-delete/:id')
  @ApiOperation({ summary: 'Delete an image by its UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the image to delete' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Image successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Param('id') id: string): Promise<void> {
    await this.imageDetailsService.deleteByImageId(id);
  }

  @Patch('image-update/:id')
  @ApiOperation({ summary: 'Update an image by its UUID' })
  @ApiParam({ name: 'id', description: 'UUID of the image to update' })
  @ApiBody({ type: ImageDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image successfully updated',
    type: ImageDto,
  })
  async updateImage(
    @Param('id') id: string,
    @Body() imageDto: ImageDto,
  ): Promise<ImageDto> {
    return this.imageDetailsService.updateByImageId(imageDto, id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Retrieve all images' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all images',
    type: [ImageViewDto],
  })
  async getAllImage(): Promise<ImageViewDto[]> {
    return this.imageDetailsService.getAllImage();
  }
}
