import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class CavMenuNavigatorService {

  constructor() { }

  /*Observable string sources.*/
  private toggleNavMenuService = new Subject<string>();

  private toggleClickPersonTest = new Subject<string>();

  /*Service message commands.*/
  toggleNavMenuAction(value: string) {

    /*Observable string streams.*/
    this.toggleNavMenuService.next(value);
  }

  toggleClickPerson(value1:string)
  {
     this.toggleClickPersonTest.next(value1);
  }

   /*Service Observable for getting Menu Toggle Action.*/
   toggleMenuProvider$ =  this.toggleNavMenuService.asObservable();

   /*Service Observable for getting Menu Toggle Action.*/
   toggleClickPersonTestProvider$ =  this.toggleClickPersonTest.asObservable();

  private toogleRouteLoader = new Subject<boolean>();
  toggleRoutingLoader(value: boolean) {
    this.toogleRouteLoader.next(value);
  }
  /*Service Observable for getting Showing Loading Icon on route.*/
  toggleRouteLoaderProvider$ =  this.toogleRouteLoader.asObservable();
 
}
