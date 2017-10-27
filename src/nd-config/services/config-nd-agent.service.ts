import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import {ConfigRestApiService} from './config-rest-api.service';
import { NDAgentInfo, CmonInfo } from '../interfaces/nd-agent-info';
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

   getInstanceList(): Observable<any[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_AUTO_DISCOVERED_INSTANCE);
  }

     discoverData(data): Observable<AutoDiscoverData>{
    return this._restApi.getDataByPostReq(URL.DISCOVER_DATA, data);
  }


}
