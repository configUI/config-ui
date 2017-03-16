import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from 'primeng/primeng';

@Injectable()
export class ConfigUtilityService {

  constructor() { }

  /**It's for showing mesages */
  private _message: Message[] = [];

  /*Observable for update message sources.*/
  private _messageObser = new Subject<Message[]>();
  
  /*Service message commands.*/
  messageEmit(message) {
    this._messageObser.next(message);
  }
  /*Service Observable for getting update message.*/
  messageProvider$ = this._messageObser.asObservable();


  public errorMessage(detail: string, summary?: string) {
    this._message.length = 0;

    if (summary == undefined)
      this._message.push({ severity: 'error', detail: detail });
    else
      this._message.push({ severity: 'error', summary: summary, detail: detail });

      this.messageEmit(this._message);
  }

  public infoMessage(detail: string, summary?: string) {
    this._message.length = 0;

    if (summary == undefined)
      this._message.push({ severity: 'info', detail: detail });
    else
      this._message.push({ severity: 'info', summary: summary, detail: detail });

      this.messageEmit(this._message);
  }

  public successMessage(detail: string, summary?: string) {
    this._message.length = 0;

    if (summary == undefined)
      this._message.push({ severity: 'success', detail: detail });
    else
      this._message.push({ severity: 'success', summary: summary, detail: detail });

      this.messageEmit(this._message);
  }
}
