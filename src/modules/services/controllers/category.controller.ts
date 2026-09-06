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
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicesService } from '../services.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: ServicesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() data: CreateCategoryDto, @Req() req) {
    return this.categoryService.createCategory(data);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAllCategory(){
    return this.categoryService.getAllCategory()
  }

  @Get(':identifier')
  @HttpCode(HttpStatus.OK)
  getSingleCategory(@Param('identifier') identifier:string){
    return this.categoryService.getSingleCategory(identifier)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateSingleCategory(@Param('id') id:string,@Body() data:UpdateCategoryDto){
    return this.categoryService.updateSingleCategory(id,data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteSingleCategory(@Param('id') id:string){
    return this.categoryService.deleteSingleCategory(id)
  }
  

  
}
