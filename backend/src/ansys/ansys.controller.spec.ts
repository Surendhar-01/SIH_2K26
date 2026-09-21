import { Test, TestingModule } from '@nestjs/testing';
import { AnsysController } from './ansys.controller';

describe('AnsysController', () => {
  let controller: AnsysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnsysController],
    }).compile();

    controller = module.get<AnsysController>(AnsysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
