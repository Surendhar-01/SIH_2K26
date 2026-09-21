import { Test, TestingModule } from '@nestjs/testing';
import { OptimizationController } from './optimization.controller';

describe('OptimizationController', () => {
  let controller: OptimizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptimizationController],
    }).compile();

    controller = module.get<OptimizationController>(OptimizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
