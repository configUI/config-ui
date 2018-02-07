import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import {ConfigRestApiService} from './config-rest-api.service';
import { ApplicationInfo } from '../interfaces/application-info';
import * as URL from '../constants/config-url-constant';
import { EntityInfo } from '../interfaces/entity-info';

@Injectable()
export class ConfigApplicationService {

  constructor(private _restApi: ConfigRestApiService) { }

  /**For Storing Profile Name. which is used to show in Meta-data component */
  private _applicationName = new Subject<string>();

  applicationNameProvider$ = this._applicationName.asObservable();

  applicationNameObserver(applicationName: string){
    this._applicationName.next(applicationName);
  }

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

  generateNDConf(data): Observable<String>{
    let url = `${URL.GENERATE_ND_CONF}/${data}`;
    return this._restApi.getDataByGetReq(url);
  }

  getAppName(appId): Observable<String>{
    return this._restApi.getDataByGetReqWithNoJson(`${URL.GET_APP_NAME}/${appId}`);
  }

  addTopoDetails(topoName): Observable<EntityInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.ADD_TOPO_DETAILS}`, topoName);
  }
  
}
