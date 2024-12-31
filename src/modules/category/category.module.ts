import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  exports: [CategoriesService,  TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
})
export class CategoriesModule {}
