import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallModule } from './call/call.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TwilioModule, CallModule, MongooseModule.forRoot('mongodb+srv://maleekaFatima:safeBidDB@safebiddb.g55cd.mongodb.net/IVRSystem?retryWrites=true&w=majority'), DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
