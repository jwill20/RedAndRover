import { Test, TestingModule } from '@nestjs/testing';
import { RoverService } from './rover.service';
import { ConfigService } from '@nestjs/config';

describe('RoverService', () => {
  let service: RoverService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoverService, ConfigService],
    }).compile();

    service = module.get<RoverService>(RoverService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
