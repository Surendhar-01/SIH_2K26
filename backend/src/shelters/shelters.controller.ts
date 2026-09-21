import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SheltersService } from './shelters.service';
import { Shelter } from './schemas/shelter.schema';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('shelters')
@ApiBearerAuth()
@Controller('shelters')
export class SheltersController {
  constructor(private readonly sheltersService: SheltersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shelter configuration' })
  create(@Body() createShelterDto: Partial<Shelter>) {
    return this.sheltersService.create(createShelterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shelters' })
  findAll() {
    return this.sheltersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shelter by ID' })
  findOne(@Param('id') id: string) {
    return this.sheltersService.findById(id);
  }
}
