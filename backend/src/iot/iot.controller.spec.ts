import { Test, TestingModule } from '@nestjs/testing';
import { IoTController } from './iot.controller';

describe('IoTController', () => {
  let controller: IoTController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IoTController],
    }).compile();

    controller = module.get<IoTController>(IoTController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
