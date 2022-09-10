import { Controller, Logger, Get, Param, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoverService } from './rover.service';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Controller('rover')
export class RoverController {

    private readonly logger = new Logger(RoverController.name);

    constructor(private readonly roverService: RoverService,
                private readonly configService: ConfigService,
                private readonly httpService: HttpService) { 
    
    this.logger.log('controller:constructor => Ready for action');
    this.logger.log('controller:constructor => ' + configService.get<string>("POSTGRES_PORT"));
    this.logger.log('controller:constructor => ' + configService.get<string>("POSTGRES_HOST"));
    this.logger.log('controller:constructor => ' + configService.get<string>("POSTGRES_USER"));
    this.logger.log('controller:constructor => ' + configService.get<string>("POSTGRES_DB"));
    this.logger.log('controller:constructor => ' + configService.get<string>("POSTGRES_PASSWORD"));
    }


  @Get('/healthCheck')
  async healthCheck(): Promise<string> {

    this.logger.log('controller:healthcheck => Health is good');

    return 'Health is good';

  }
  
  @Get('/pingPlatform')
  async pingPlatform(): Promise<string> {
    this.logger.log('controller:pingPlatform => Pinging Platform');

    let result;

    try {
      this.logger.log('controller:pingPlatform => Pinging Kushlie');
      result = await axios.get(this.configService.get<string>("KUSHLIE_URL"));
      console.log(result.data);
    } catch (e) {
      this.logger.log('controller:pingPlatform => Bad things happened');
      console.log(e);
    }  

    return result.data;

  }

  @Get('/pingPostgres')
  async pingPostgres(): Promise<string> {

    this.logger.log('controller:pingPostgres => Pinging Postgres');

    return (this.roverService.pingPostgres());

  }

  @Get('/loadMongo')
  async loadMongo(): Promise<string> {

    this.logger.log('controller:loadMongo => Loading MongoDB');

    return (this.roverService.loadMongo());

  }

  @Get('/pingMongo/:firstName')
  async pingMongo(@Param('firstName') firstName: string): Promise<string> {
    this.logger.log('controller:pingMongo => Pinging MongoDB');

    return (this.roverService.pingMongo(firstName));

  }

  @Get('/leapYear/:year')
  async leapYear(@Param('year') year: number): Promise<object> {
    this.logger.log('controller:leapYear => Determining leap years starting at given year');
    
    let startYear: number = year;
    let result = false;
    let returnArray = [];
    
    for (let a: number = startYear; a < 2023; a++) {

      result = false;
      result = ((startYear % 100 === 0) ? ( startYear % 400 === 0) : (startYear % 4 === 0));
      console.log(startYear);
      console.log(result);
      startYear++;

      if (result === true) {
        returnArray.push({startYear: a, value: result});       
      }  
      
    }
    return returnArray;

    /* Evenly divided by 4 (2012, 2016) 			IS, UNLESS
    Except if evenly divided by 100 (2100, 2200)	IS NOT, UNLESS
    Except if evenly divided by 400 (2000, 2400) 	IS
    */

  }
}
