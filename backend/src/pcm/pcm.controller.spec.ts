import { Test, TestingModule } from '@nestjs/testing';
import { PcmController } from './pcm.controller';

describe('PcmController', () => {
  let controller: PcmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcmController],
    }).compile();

    controller = module.get<PcmController>(PcmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
