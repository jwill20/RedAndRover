import { Module } from '@nestjs/common';
import { RoverController } from './rover.controller';
import { RoverService } from './rover.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RoverController],
  providers: [RoverService]
})
export class RoverModule {}


