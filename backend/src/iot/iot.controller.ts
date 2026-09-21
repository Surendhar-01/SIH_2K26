import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { IoTService } from './iot.service';
import { SensorReading } from './schemas/iot.schema';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('iot')
@Controller('iot')
export class IoTController {
  constructor(private readonly iotService: IoTService) {}

  @Post('readings')
  @ApiOperation({
    summary: 'Ingest hardware telemetry payload from ESP32/Sensors',
  })
  logReading(@Body() body: Partial<SensorReading>) {
    return this.iotService.logReading(body);
  }

  @Get('devices/:id/readings')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get latest readings for a given device id to map Digital Twin',
  })
  getReadings(@Param('id') deviceId: string, @Query('limit') limit: number) {
    return this.iotService.getReadingsByDevice(deviceId, limit || 24);
  }
}
