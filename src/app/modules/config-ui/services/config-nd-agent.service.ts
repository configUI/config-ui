import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import {ConfigRestApiService} from './config-rest-api.service';
import { NDAgentInfo } from '../interfaces/nd-agent-info';
import * as URL from '../constants/config-url-constant';


@Injectable()
export class ConfigNdAgentService {

  constructor(private _restApi: ConfigRestApiService) { }

   getNDAgentStatusData(): Observable<NDAgentInfo[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_ND_AGENT_TABLEDATA);
  }

}