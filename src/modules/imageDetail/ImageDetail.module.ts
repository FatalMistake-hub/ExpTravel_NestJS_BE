import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageDetailsService } from './ImageDetail.service';
import { ImageDetail } from './imageDetail.entity';
import { ImageDetailController } from './ImageDetail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ImageDetail])],
  providers: [ImageDetailsService],
  exports: [ImageDetailsService,  TypeOrmModule.forFeature([ImageDetail])],
  controllers: [ImageDetailController],
})
export class ImageDetailsModule {}
