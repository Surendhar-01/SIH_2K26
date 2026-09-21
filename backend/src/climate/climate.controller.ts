import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ClimateService } from './climate.service';
import { Climate } from './schemas/climate.schema';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('climate')
@ApiBearerAuth()
@Controller('climate')
export class ClimateController {
  constructor(private readonly climateService: ClimateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new climate preset' })
  create(@Body() createClimateDto: Partial<Climate>) {
    return this.climateService.create(createClimateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all climate presets' })
  findAll() {
    return this.climateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get climate by ID' })
  findOne(@Param('id') id: string) {
    return this.climateService.findById(id);
  }
}
