import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import {ProfileInfo} from '../interfaces/profile-info';

@Injectable()
export class ConfigProfileService {

  constructor(private _restApi: ConfigRestApiService) { }

  getProfileList(): Observable<ProfileInfo[]>{
    return this._restApi.getDataByGetReq(URL.FETCH_PROFILE_TABLEDATA);
  }
}
