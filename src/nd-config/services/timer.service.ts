import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

/**This class is used as a global timer service for providing the time event per second. It can be used for system clock, elapsed time
 * and time based data processing.*/
@Injectable()
export class TimerService {

  private timer: any;

  /*Observable string sources.*/
  private timerEventProvider = new Subject<number>();

  /*Service Observable for getting Progress Bar Toggle Action.*/
  private timerObservable =  this.timerEventProvider.asObservable();

  constructor() {
    /* Creating Timer Here. */
    this.timer = Observable.timer(0, 1000).subscribe(t => {
         /*Forwarding request to all observer..*/
         this.timerEventProvider.next(t);
      });
  }

  /**Getting Timer Subscription. */
  getTimerSubscription() {
    return this.timerObservable;
  }



}
