import { Test, TestingModule } from '@nestjs/testing';
import { IoTService } from './iot.service';

describe('IoTService', () => {
  let service: IoTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IoTService],
    }).compile();

    service = module.get<IoTService>(IoTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
