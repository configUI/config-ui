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
  
  // private _trData: TRData;

  private _trData: TRData;

	public get trData(): TRData { 
    if(sessionStorage.getItem("trData") != null) {
      return JSON.parse(sessionStorage.getItem("trData"));
    }
		return this._trData;
	}

	public set trData(value: TRData) {
    sessionStorage.setItem("trData", JSON.stringify(value));
		this._trData = value;
	}
  
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

  importTopology(topoName): Observable<EntityInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_TOPOLOGY}`, topoName);
  }

  getTopologyList(){
    return this._restApi.getDataByGetReq(URL.GET_TOPO_LIST);
  }
}
