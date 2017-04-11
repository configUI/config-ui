import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { ProfileData } from '../containers/profile-data';

@Injectable()
export class ConfigProfileService {

  constructor(private _restApi: ConfigRestApiService) { }

  getProfileList(): Observable<ProfileData[]> {
    return this._restApi.getDataByGetReq(URL.FETCH_PROFILE_TABLEDATA);
  }

  addProfileData(data): Observable<ProfileData>{
    return this._restApi.getDataByPostReq(URL.UPDATE_PROFILE_TABLE, data);
  }
}
