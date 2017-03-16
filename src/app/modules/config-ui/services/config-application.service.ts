import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import {ConfigRestApiService} from './config-rest-api.service';
import { ApplicationInfo } from '../interfaces/application-info';
import * as URL from '../constants/config-url-constant';

@Injectable()
export class ConfigApplicationService {

  constructor(private _restApi: ConfigRestApiService) { }

  //applicationData: ApplicationInfo[];

  getApplicationList(): Observable<ApplicationInfo[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_APP_TABLE_DATA);
  }

  addApplicationData(data): Observable<ApplicationInfo>{
    return this._restApi.getDataByPostReq(URL.ADD_ROW_APP_URL, data);
  }

  editApplicationData(data): Observable<ApplicationInfo>{
    let url = `${URL.ADD_ROW_APP_URL}/${data.appId}`
    return this._restApi.getDataByPutReq(url, data);
  }

  deleteApplicationData(data): Observable<ApplicationInfo>{
    return this._restApi.getDataByPostReq(URL.DEL_ROW_APP_URL, data);
  }
}
