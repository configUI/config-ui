import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ConfigRestApiService } from './config-rest-api.service';

import { MainInfo } from '../interfaces/main-info';
import { EntityInfo } from '../interfaces/entity-info';
import * as URL from '../constants/config-url-constant';

@Injectable()
export class ConfigHomeService {

  constructor(private _restApi: ConfigRestApiService) { }

  getMainData(): Observable<MainInfo> {
    return this._restApi.getDataByGetReq(URL.HOME_SCREEN_URL);
  }

  importTopology(): Observable<EntityInfo[]> {
    return this._restApi.getDataByGetReq(URL.UPDATE_TOPOLOGY);
  }
}
