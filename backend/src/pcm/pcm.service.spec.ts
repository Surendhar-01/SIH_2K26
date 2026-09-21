import { Test, TestingModule } from '@nestjs/testing';
import { PcmService } from './pcm.service';

describe('PcmService', () => {
  let service: PcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcmService],
    }).compile();

    service = module.get<PcmService>(PcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
