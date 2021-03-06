import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import {ConfigRestApiService} from './config-rest-api.service';
import { NDAgentInfo, CmonInfo, CmonEnvInfo } from '../interfaces/nd-agent-info';
import * as URL from '../constants/config-url-constant';
import { AutoDiscoverData } from "../containers/auto-discover-data";


@Injectable()
export class ConfigNdAgentService {

  constructor(private _restApi: ConfigRestApiService) { }

   getNDAgentStatusData(): Observable<NDAgentInfo[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_ND_AGENT_TABLEDATA);
  }

   getCmonStatusData(): Observable<CmonInfo[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_CMON_TABLEDATA);
  }

   getInstanceList(agentType): Observable<any[]>{
    return this._restApi.getDataByPostReq(URL.FETCH_AUTO_DISCOVERED_INSTANCE,agentType);
  }

     discoverData(data): Observable<AutoDiscoverData>{
    return this._restApi.getDataByPostReq(URL.DISCOVER_DATA, data);
  }

    getCmonEnvKeyValueForShow(cmonInfoArr: any): Observable<object> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_CMON_ENV_KEYVALUE_VIEW}`, cmonInfoArr);
    }
    
    getCmonEnvKeyValueForEdit(cmonInfoArr : any): Observable<CmonEnvInfo> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_CMON_ENV_KEYVALUE_EDIT}`,cmonInfoArr);
    }
    
    getCmonEnvKeyValueUpdate(cmonInfoArr:any): Observable<any> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_CMON_ENV_KEYVALUE}`,cmonInfoArr);
    }
    
    getCmonEnvRestartedStatus(restartedCmonAgentList: string[]): Observable<object> {
    return this._restApi.getDataByPostReq(`${URL.RESTART_CMON_ENV_AGENT}`, restartedCmonAgentList);
    }

    listFiles(data: string): Observable<string[]>{
      return this._restApi.getDataByPostReq(`${URL.LIST_BCI_FILES}`, data)
    }

    downloadAgentFile(data: string): Observable<any>{
      return this._restApi.getDataByPostReqWithNoJSON(`${URL.DOWNLOAD_BCI_FILE}`, data)
    }
}
