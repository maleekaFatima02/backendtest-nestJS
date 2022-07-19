import { Body, Controller, Post, Get, Patch } from '@nestjs/common';
import { CallService } from './call.service';
import { callDto } from './call.dto';
import { Call, CallDocument } from './call.schema';

@Controller('call')
export class CallController {
    constructor(private readonly callService: CallService) {}

  @Get('log')
  async callLog(): Promise<any> {
    return await this.callService.callLog();
  }

  @Post('incoming')
  async incomingCall(@Body() body: callDto): Promise<string> {
    return await this.callService.incomingCall(body);
  }

  @Post('menu')
  async menu(@Body() body: callDto): Promise<string> {
    return await this.callService.menu(body);
  }

  @Post('forwarding')
  async callForwarding(): Promise<string> {
    return await this.callService.callForwarding();
  }

  @Post('save')
  async saveCall(@Body() body: callDto): Promise<string> {
    return await this.callService.saveCall(body);
  }

  @Post('voiceMail')
  async voiceMailing(): Promise<string> {
    return await this.callService.voiceMailing();
  }

  @Post('saveVoiceMail')
  async saveVoiceMail(@Body() body: callDto): Promise<string> {
    return await this.callService.saveVoiceMail(body);
  }

}

