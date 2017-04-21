import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { ConfigRestApiService } from './config-rest-api.service';

import { MainInfo, TRData } from '../interfaces/main-info';
import { EntityInfo } from '../interfaces/entity-info';
import * as URL from '../constants/config-url-constant';

@Injectable()
export class ConfigHomeService {

  private trDataSource = new Subject<TRData>();
  
  trData :TRData;
  // Observable string streams
  trData$ = this.trDataSource.asObservable();

  // Service message commands
  setTrData(trData: TRData) {
    this.trDataSource.next(trData);
  }

  constructor(private _restApi: ConfigRestApiService) { }

  getMainData(): Observable<MainInfo> {
    return this._restApi.getDataByGetReq(URL.HOME_SCREEN_URL);
  }

  importTopology(): Observable<EntityInfo[]> {
    return this._restApi.getDataByGetReq(URL.UPDATE_TOPOLOGY);
  }
}
