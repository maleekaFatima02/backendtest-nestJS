import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { InjectModel } from '@nestjs/mongoose';
import { Call, CallDocument } from './call.schema';

const VoiceResponse = require('twilio').twiml.VoiceResponse;

@Injectable()
export class CallService {
    constructor(
        @InjectTwilio() private readonly client: TwilioClient,
        @InjectModel(Call.name) private callModel: Model<CallDocument>) { }

    async callLog() {
        try {
            const calls = await this.callModel.find().sort({ createdAt: -1 });
            return calls;
        }
        catch (e) {
            console.log(e.message)
            return ({
                error: e.message
            });
        }
    }

    async incomingCall(body) {
        console.log(body);
        try {
            const call = new this.callModel({
                sid: body.CallSid,
                to: body.To,
                from: body.From,
                duration: 0,
                status: body.CallStatus
            })
            await call.save();
            const twiml = new VoiceResponse();
            const gather = twiml.gather({
                action: '/call/menu',
                numDigits: '1',
                method: 'POST',
            });

            gather.say(
                ' Welcome to Maleeka`s IRV System.  ' +
                ' Please press 1 for call forwarding.  ' +
                ' Press 2 for leaving a voice mail.  ' +
                '                   ', {
                loop: 3
            }
            );
            return twiml.toString();
        } catch (e) {
            console.log(e.message)
            return ({
                error: e.message
            });
        }
    }

    async menu(body){
        console.log(body);
        try {
            const twiml = new VoiceResponse();
            await this.callModel.findOneAndUpdate({
                sid: body.CallSid
            }, {
                status: body.CallStatus
            });
    
            switch (body.Digits) {
                case '1':
                    twiml.redirect('/call/forwarding');
                    break;
                case '2':
                    twiml.redirect('/call/voiceMail');
                    break;
                default:
                    twiml.say('Incorrect option. Ending Call.');
                    twiml.redirect('/call/save');
            }
            return twiml.toString();
        } catch (e) {
            console.log(e.message)
            return ({
                error: e.message
            });
        }
    }

    async callForwarding(){
        try {
            const twiml = new VoiceResponse();
            twiml.dial('+33123456789');
            twiml.redirect('/call/save');
            return twiml.toString();
        }
        catch (e) {
            return ({
                error: e.message
            });
        }
    }

    async saveCall(body){
        console.log(body);
        try {
            let call = await this.callModel.findOne({sid:body.CallSid});
            const twiml = new VoiceResponse();
            twiml.say(" Your Call is saved.");
            twiml.hangup();
            await this.callModel.findOneAndUpdate({
                sid: body.CallSid
            }, {
                status: 'Completed',
                duration: (Date.now() - new Date(call.createdAt).getTime())/1000
            });
            return twiml.toString();
        } catch (e) {
            console.log(e.message)
            return ({
                error: e.message
            });
        }
    }

    async voiceMailing(){
        try {
            const twiml = new VoiceResponse();
            twiml.say('Record your voicemail for Maleeka. press # to end voicemail', {
                voice: 'alice'
            });
    
            twiml.record({
                playBeep: true,
                finishOnKey: "#",
                action: "/call/saveVoiceMail",
            });
            return twiml.toString();
        } catch (e) {
            console.log(e.message)
            return ({
                error: e.message
            });
        }
    }

    async saveVoiceMail(body){
        console.log(body);
        try {
            const twiml = new VoiceResponse();
            twiml.say("Your VoiceMail is saved");
            twiml.hangup();
            await this.callModel.findOneAndUpdate({
                sid: body.CallSid
            }, {
                voiceMail: true,
                duration: body.RecordingDuration,
                voiceMailURL: body.RecordingUrl,
                status: 'Completed'
            });
            return twiml.toString();
        }   catch (e) {
            console.log(e.message)
            return ({
                error: e.message
            });
        }
    }

}
