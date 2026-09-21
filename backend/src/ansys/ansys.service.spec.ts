import { Test, TestingModule } from '@nestjs/testing';
import { AnsysService } from './ansys.service';

describe('AnsysService', () => {
  let service: AnsysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnsysService],
    }).compile();

    service = module.get<AnsysService>(AnsysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
