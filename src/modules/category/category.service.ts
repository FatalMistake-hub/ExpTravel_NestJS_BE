import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>, // 1.
  ) { }
  async getAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find();
    return plainToInstance(CategoryDto, categories);
  }
  async createCategory(categoryDto: CategoryDto): Promise<CategoryDto> {
    const category = this.categoryRepository.create(categoryDto);
    await this.categoryRepository.save(category);
    return categoryDto;
  }

  async findCategoryById(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return plainToInstance(CategoryDto, category);
  }

  async deleteByCategoryId(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.delete(id);
  }

  async updateByCategoryId(categoryDto: CategoryDto, id: number): Promise<CategoryDto> {
    let category = await this.categoryRepository.findOne({
      where: { categoryId: id },
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
