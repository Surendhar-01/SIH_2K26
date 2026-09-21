import { Test, TestingModule } from '@nestjs/testing';
import { ThermalController } from './thermal.controller';

describe('ThermalController', () => {
  let controller: ThermalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThermalController],
    }).compile();

    controller = module.get<ThermalController>(ThermalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
