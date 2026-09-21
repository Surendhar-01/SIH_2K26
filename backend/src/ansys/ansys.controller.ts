import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AnsysService } from './ansys.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ansys')
@ApiBearerAuth()
@Controller('ansys')
export class AnsysController {
  constructor(private readonly ansysService: AnsysService) {}

  @Post('jobs')
  @ApiOperation({ summary: 'Creates a new async ANSYS validation job' })
  createJob(@Body() body: { shelterId: string }) {
    return this.ansysService.createJob(body.shelterId);
  }

  @Post('jobs/:id/run')
  @ApiOperation({
    summary: 'Processes the ANSYS APDL export generation adapter',
  })
  runJob(@Param('id') jobId: string) {
    return this.ansysService.processJob(jobId);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get ANSYS job status' })
  getJob(@Param('id') jobId: string) {
    return this.ansysService.getJob(jobId);
  }
}
