import { Test, TestingModule } from '@nestjs/testing';
import { RoverController } from './rover.controller';
import { RoverService } from './rover.service';
import { ConfigService } from '@nestjs/config';

describe('RoverController', () => {
  let controller: RoverController;
  let config: ConfigService;
  let service: RoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoverController],
      providers: [ConfigService, RoverService],
    }).compile();

    controller = module.get<RoverController>(RoverController);
    config = module.get<ConfigService>(ConfigService);
    service = module.get<RoverService>(RoverService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
