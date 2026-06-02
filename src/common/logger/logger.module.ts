import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppLogger } from './logger.service';

@Global()

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level:process.env.NODE_ENV ==='production'? 'info': 'debug',
                autoLogging: true,
                serializers: {req() {return undefined}, res() {return undefined}},
                customSuccessMessage(req,res) {
                return `${req.method} ${req.url}`},
                customReceivedMessage() {return ''},

                customErrorMessage(req, res) { return `${req.method} ${req.url}` },
                transport: process.env.NODE_ENV === 'production' ? undefined : {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        translateTime: 'HH:MM:ss',
                        ignore: 'pid,hostname'
                    }
                }
            }
        })
    ],
    providers: [ AppLogger],
    exports: [ AppLogger, LoggerModule]
})

export class LoggerSharedModule { }