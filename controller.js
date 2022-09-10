import { Controller, Logger, Get, Post, Body } from '@nestjs/common';
import { TbpService } from './tbp.service';


@Controller('tbp')
export class TbpController {

  private readonly logger = new Logger(TbpController.name);
  constructor(private readonly tbpService: TbpService) { }

  /***************************************************************/
  /* Incoming utterances                                         */
  /***************************************************************/
  @Post('/utterances')
  async processUtterances(@Body() incomingUtterance): Promise<string> {
    this.logger.verbose('controller:processUtterances => Incoming utterance');
    const utteranceResponse = await this.tbpService.processUtterances(incomingUtterance);
    return utteranceResponse;
  }

  /***************************************************************/
  /* Get token expiration time                                   */
  /***************************************************************/
  @Get('/expirationtime')
  async getExpirationTime(): Promise<string> {
    this.logger.verbose('controller:expirationtime => Invoked');
    return await this.tbpService.getExpirationTime();
  }

  /***************************************************************/
  /* Healthcheck                                                 */
  /***************************************************************/
  @Get('/healthCheck')
  async healthCheck(): Promise<string> {
    this.logger.verbose('controller:healthcheck => Health is good');
    return 'Health is good';
  }

  /***************************************************************/
  /* reload bots endpoint                                        */
  /***************************************************************/
  @Get('/admin/config/reload')
  async reload(): Promise<string> {
    this.logger.verbose('controller:reload => Reloaded TBP Credentials');
    this.tbpService.reload(true);
    return 'Credentials reloaded';
  }

  /***************************************************************/
  /* Shows the creds we currently have in memory                 */
  /***************************************************************/
  @Get('/admin/config/bots')
  async bots(): Promise<string> {
    this.logger.verbose('controller:bots => Displaying loaded credentials');
    this.logger.verbose(JSON.stringify(this.tbpService.tbpCredsArray));
    return this.tbpService.tbpCredsArray;
  }

}
