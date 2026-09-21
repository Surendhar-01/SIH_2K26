import { Controller, Get, Post, Body } from '@nestjs/common';
import { PcmService } from './pcm.service';
import { Pcm } from './schemas/pcm.schema';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('pcm')
@ApiBearerAuth()
@Controller('pcm')
export class PcmController {
  constructor(private readonly pcmService: PcmService) {}

  @Post()
  @ApiOperation({ summary: 'Inject new Phase Change Material (PCM) into DB' })
  create(@Body() createPcmDto: Partial<Pcm>) {
    return this.pcmService.create(createPcmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all PCMs' })
  findAll() {
    return this.pcmService.findAll();
  }
}
