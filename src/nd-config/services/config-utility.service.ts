import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from 'primeng/primeng';

@Injectable()
export class ConfigUtilityService {

  constructor() { }

  /**It's for showing mesages */
  private _message: Message[];

  /*Observable for update message sources.*/
  private _messageObser = new Subject<Message[]>();
  
  /*Service message commands.*/
  messageEmit(message) {
    this._messageObser.next(message);
  }
  /*Service Observable for getting update message.*/
  messageProvider$ = this._messageObser.asObservable();


  /*Observable for update progress bar sources.*/
  private _progressBarObser = new Subject();
  
  /*Service message commands.*/
  progressBarEmit(flag) {
    this._progressBarObser.next(flag);
  }
  /*Service Observable for getting update message.*/
  progressBarProvider$ = this._progressBarObser.asObservable();


  public errorMessage(detail: string, summary?: string) {

    if (summary == undefined)
      this._message = [{ severity: 'error', detail: detail }];
    else
      this._message = [{ severity: 'error', summary: summary, detail: detail }];

      this.messageEmit(this._message);
  }

  public infoMessage(detail: string, summary?: string) {
    
    if (summary == undefined)
      this._message = [{ severity: 'info', detail: detail }];
    else
      this._message = [{ severity: 'info', summary: summary, detail: detail }];

      this.messageEmit(this._message);
  }

  public successMessage(detail: string, summary?: string) {

    if (summary == undefined)
      this._message = [{ severity: 'success', detail: detail }];
    else
      this._message = [{ severity: 'success', summary: summary, detail: detail }];

      this.messageEmit(this._message);
  }
}
