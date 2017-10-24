import { Injectable } from '@angular/core';
import { LogLevel } from '../shared/logLevel';
import { LogPublishersService } from './log-publishers.service';
import { LogPublisher } from './log-publishers';

export class LogEntry {
  entryDate: Date = new Date();
  message = '';
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate = false;

  buildLogString(): string {
    let ret = '';

    if (this.logWithDate) {
      ret = new Date() + '';
    }
    ret += LogLevel[this.level] + this.message;

    if (this.extraInfo.length) {
      ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
    }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');
    if (params.some(p => typeof p === 'object')) {
      ret = '';
      for (const item of params) {
        ret +=  JSON.stringify(item) + ',';
      }
    }

    return ret;

  }
}



@Injectable()
export class LogService {
  level: LogLevel = LogLevel.All;
  logWithDate = true;
  publishers: LogPublisher[];

  constructor( private publisherService: LogPublishersService) {

    this.publishers = this.publisherService.publishers;
  }

  private shouldLog(level: LogLevel): boolean {

    let ret = false;
    if (this.level !== LogLevel.Off && level >= this.level) {
      ret = true;
    }
    return ret;
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      const entry: LogEntry = new LogEntry();
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      // Log the value to all publishers
      for ( const logger of this.publishers) {
        logger.log(entry).subscribe(res => console.log(res));
      }

    }

  }



  log (msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  debug(msg:string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg:string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg:string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg:string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg:string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }
}
