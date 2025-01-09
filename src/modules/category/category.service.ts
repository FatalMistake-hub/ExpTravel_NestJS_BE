import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async getAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find();
    return plainToInstance(CategoryDto, categories);
  }
  async createCategory(categoryDto: CategoryDto): Promise<CategoryDto> {
    const category = this.mapper.map(categoryDto, CategoryDto, Category);
    console.log(category, categoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    return this.mapper.map(savedCategory, Category, CategoryDto);
  }

  async findCategoryById(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return plainToInstance(CategoryDto, category);
  }

  async deleteByCategoryId(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.delete(id);
  }

  async updateByCategoryId(
    categoryDto: CategoryDto,
    id: number,
  ): Promise<CategoryDto> {
    let category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });
    if (!category) {
      categoryDto.categoryId = id;
      category = this.categoryRepository.create(categoryDto);
      await this.categoryRepository.save(category);
    } else {
      category.categoryName = categoryDto.categoryName;
      category = await this.categoryRepository.save(category);
    }
    return plainToInstance(CategoryDto, category);
  }
}
