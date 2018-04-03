import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { ProfileData } from '../containers/profile-data';
import { NodeData } from '../containers/node-data';

@Injectable()
export class ConfigProfileService {

  constructor(private _restApi: ConfigRestApiService) { }
  nodeData: NodeData;

  /**For Storing Profile Name. which is used to show in Meta-data component */
  private _profileName = new Subject<string>();


  profileNameProvider$ = this._profileName.asObservable();

  // private _nodeData = new Subject<NodeData>();
  // /** this  is used for maintaing data from which node configuration screen or profile is navigated to
  //  * This data is required for runTime Changes
  //  */
  // nodeDataProvider$ = this._nodeData.asObservable();

  // /***this function is called from tree-detail component whenever from any node profile is navigated to 
  //  * 
  // */
  // nodeDataObserver(nodeData:NodeData){
  //   console.log("nodeData--",nodeData)
  //   this._nodeData.next(nodeData);
  // }

  profileNameObserver(profileName: string) {
    this._profileName.next(profileName);
  }

  getProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_PROFILE_TABLEDATA}`);
  }

  getJavaTypeProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_JAVA_PROFILE_TABLEDATA}`);
  }

  getDotNetTypeProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_DOTNET_PROFILE_TABLEDATA}`);
  }

  getNodeJSTypeProfileList(): Observable<ProfileData[]> { 
    return this._restApi.getDataByGetReq(`${URL.FETCH_NODEJS_PROFILE_TABLEDATA}`);
  }

  addProfileData(data): Observable<ProfileData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_PROFILE_TABLE}`, data);
  }

  getProfileName(profileId: number): Observable<string> {
    return this._restApi.getDataByGetReq(`${URL.GET_PROFILE_NAME}/${profileId}`);
  }

  deleteProfileData(data): Observable<any>{
    return this._restApi.getDataByPostReq(URL.DEL_PROFILE, data);
  }

  getProfileAgent(profileName): Observable<any>{
    return this._restApi.getDataByPostReqWithNoJSON(URL.GET_PROFILE_AGENT, profileName);
  }

  importProfile(filePath,username): Observable<any>{
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.IMPORT_PROFILE}/${username}`, filePath);
  }

  exportProfile(exportPath,data): Observable<any>{
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.EXPORT_PROFILE}/${exportPath}`, data);
  }

}
