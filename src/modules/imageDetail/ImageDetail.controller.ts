import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImageDetailsService } from './ImageDetail.service';

// import { ChangePasswordResponse } from './response/change-password.response';

@Controller('image')
@ApiTags('image')
export class ImageDetailController {
  constructor(private readonly imageService: ImageDetailsService) {}
}
