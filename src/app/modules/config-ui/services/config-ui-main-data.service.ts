import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

/**Import RxJs Required methods */
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/toPromise';

import * as URL from '../constants/config-ui-url-constant';
import { MainInfo } from '../interfaces/main-info';

@Injectable()
export class ConfigUiMainDataService {

  constructor(private http: Http) { }

  mainInfo: MainInfo;

    getMainData(): Observable<MainInfo> {
    if(this.mainInfo)
      return Observable.of(this.mainInfo);

    return this.http.get(URL.HOME_SCREEN_URL)
      .map((res: Response) => {
        return this.mainInfo = res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
