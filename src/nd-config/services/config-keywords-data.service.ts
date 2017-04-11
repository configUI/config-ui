import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import {ConfigRestApiService} from './config-rest-api.service';
import { KeywordsInfo } from '../interfaces/keywords-info';
import { Keywords } from '../interfaces/keywords';
import * as URL from '../constants/config-url-constant';



@Injectable()
export class ConfigKeywordsDataService {

  constructor(private _restApi: ConfigRestApiService) { }

  
 getKeywordsData(profileId): Observable<Keywords>{
    let url = `${URL.GET_KEYWORDS_DATA}/${profileId}`
    return this._restApi.getDataByGetReq(url)
  }

  saveKeywordData(data,profileId): Observable<Keywords>{
    let url = `${URL.UPDATE_KEYWORDS_DATA}/${profileId}`
    return this._restApi.getDataByPostReq(url,data)
  }

}