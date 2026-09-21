import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { Material } from './schemas/material.schema';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('materials')
@ApiBearerAuth()
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material' })
  create(@Body() createMaterialDto: Partial<Material>) {
    return this.materialsService.create(createMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  findOne(@Param('id') id: string) {
    return this.materialsService.findById(id);
  }
}
