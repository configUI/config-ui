import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { ProfileData } from '../containers/profile-data';

@Injectable()
export class ConfigProfileService {

  constructor(private _restApi: ConfigRestApiService) { }

  /**For Storing Profile Name. which is used to show in Meta-data component */
  private _profileName = new Subject<string>();

  profileNameProvider$ = this._profileName.asObservable();

  profileNameObserver(profileName: string){
    this._profileName.next(profileName);
  }

  getProfileList(): Observable<ProfileData[]> {
    return this._restApi.getDataByGetReq(URL.FETCH_PROFILE_TABLEDATA);
  }

  addProfileData(data): Observable<ProfileData> {
    return this._restApi.getDataByPostReq(URL.UPDATE_PROFILE_TABLE, data);
  }

  getProfileName(profileId: number): Observable<string>{
    return this._restApi.getDataByGetReq(`${URL.GET_PROFILE_NAME}/${profileId}`);
  }
}
