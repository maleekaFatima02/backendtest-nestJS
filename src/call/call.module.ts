import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { MongooseModule } from '@nestjs/mongoose';
import { CallController } from './call.controller';
import { CallService } from './call.service';
import { Call, CallSchema } from './call.schema';

@Module({
  imports: [TwilioModule.forRoot({
    accountSid: "AC929a7a92717f511935ce3d61966a048c",
    authToken: "ecb1ec0de900183623d8c5e59b2a0e65",
  }),MongooseModule.forFeature([{ name: Call.name, schema: CallSchema }])],
  controllers: [CallController],
  providers: [CallService]
})
export class CallModule {}
