import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoriesService } from './category.service';
import { CategoryProfile } from './category.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  providers: [CategoriesService,CategoryProfile],
  exports: [CategoriesService, TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
})
export class CategoriesModule {}
