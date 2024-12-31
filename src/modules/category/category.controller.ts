import { Controller, Get, Post, Delete, Patch, Param, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';
import { ValidationPipe } from '@nestjs/common';
import { IsNumber } from 'class-validator';
import { CategoriesService } from './category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'All categories fetched successfully', type: [CategoryDto] })
  async getAllCategory(): Promise<CategoryDto[]> {
    return this.categoriesService.getAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category fetched successfully', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('id') id: number): Promise<CategoryDto> {
    return this.categoriesService.findCategoryById(id);
  }

  @Post('/create/')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 200, description: 'Category created successfully', type: CategoryDto })
  async createCategory(@Body() categoryDto: CategoryDto): Promise<CategoryDto> {
    return this.categoriesService.createCategory(categoryDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategory(@Param('id') id: number): Promise<void> {
    await this.categoriesService.deleteByCategoryId(id);
  }

  @Patch('/update/:id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryDto })
  async updateCategory(@Body(ValidationPipe) categoryDto: CategoryDto, @Param('id') id: number): Promise<CategoryDto> {
    return this.categoriesService.updateByCategoryId(categoryDto, id);
  }
}
