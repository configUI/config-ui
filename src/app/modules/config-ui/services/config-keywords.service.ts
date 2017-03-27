import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import {ServiceEntryPoint, IntegrationPTDetection, ErrorDetection} from '../containers/instrumentation-data';

@Injectable()
export class ConfigKeywordsService {

  keywordData: Object = {};

  constructor(private _restApi: ConfigRestApiService) { }

  /** For Getting all keywordData data */
  getProfileKeywords(profileId){
    this._restApi.getDataByGetReq(`${URL.GET_KEYWORDS_DATA}/${profileId}`)
    .subscribe(data => this.keywordData = data);
  }

  /** For save all keywordData data */
  saveProfileKeywords(profileId){
    this._restApi.getDataByPostReq(`${URL.UPDATE_KEYWORDS_DATA}/${profileId}`, this.keywordData)
    .subscribe(data => this.keywordData = data);
  }

  /**Service Entry Point */
  getServiceEntryPointList(profileId): Observable<ServiceEntryPoint[]>{
    return this._restApi.getDataByGetReq(`${URL.FETCH_SERVICE_POINTS_TABLEDATA}/${profileId}`);
  }

  addServiceEntryPointData(data): Observable<ServiceEntryPoint>{
    return this._restApi.getDataByPostReq(URL.ADD_NEW_SERVICE_ENTRY_POINTS, data);
  }
  
  /**For Integration PT Detection */
  getIntegrationPTDetectionList(profileId): Observable<IntegrationPTDetection[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BACKEND_TABLEDATA}/${profileId}`);
  }

  addIntegrationPTDetectionData(data): Observable<IntegrationPTDetection> {
    return this._restApi.getDataByPostReq(URL.ADD_NEW_BACKEND_POINT, data);
  }

  /**Transaction Configuration */

  /**Instrument Monitors */

  /**Error Detection */
  getErrorDetectionList(profileId): Observable<ErrorDetection[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_ERROR_DETECTION_TABLEDATA}/${profileId}`);
  }

  addErrorDetection(data): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(URL.ADD_NEW_ERROR_DETECTION, data);
  }

  editErrorDetection(data): Observable<ErrorDetection>{
    let url = `${URL.ADD_NEW_ERROR_DETECTION}/${data.errDetectionId}`
    return this._restApi.getDataByPutReq(url, data);
  }

  deleteErrorDetection(data): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(URL.DEL_ERROR_DETECTION, data);
  }



}
