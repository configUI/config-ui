import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import {  XmlFilesList } from '../interfaces/keywords-info';
import { ServiceEntryPoint, IntegrationPTDetection, ErrorDetection, MethodMonitorData } from '../containers/instrumentation-data';

@Injectable()
export class ConfigKeywordsService {

  private _keywordData: Object;


  public get keywordData(): Object {
    if (!this._keywordData)
      return {};
    return this._keywordData;
  }

  public set keywordData(value: Object) {
    this._keywordData = value;
  }


  constructor(private _restApi: ConfigRestApiService, private store: Store<Object>) {

   }

  /** For Getting all keywordData data */
  getProfileKeywords(profileId) {
    this._restApi.getDataByGetReq(`${URL.GET_KEYWORDS_DATA}/${profileId}`)
      .subscribe(data => {
        this.keywordData = data;
        this.store.dispatch({type: "keywordData", payload: data});
      });
  }

  /** For save all keywordData data */
  saveProfileKeywords(profileId) {
    this._restApi.getDataByPostReq(`${URL.UPDATE_KEYWORDS_DATA}/${profileId}`, this.keywordData)
      .subscribe(data => this.keywordData = data);
  }

  /**Service Entry Point */
  getServiceEntryPointList(profileId): Observable<ServiceEntryPoint[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SERVICE_POINTS_TABLEDATA}/${profileId}`);
  }

  addServiceEntryPointData(data,profileId): Observable<ServiceEntryPoint>{
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_SERVICE_ENTRY_POINTS}/${profileId}`,data);
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

  editErrorDetection(data): Observable<ErrorDetection> {
    let url = `${URL.ADD_NEW_ERROR_DETECTION}/${data.errDetectionId}`
    return this._restApi.getDataByPutReq(url, data);
  }

  deleteErrorDetection(data): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(URL.DEL_ERROR_DETECTION, data);
  }


  getMethodMonitorList(profileId): Observable<MethodMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_METHOD_MON_TABLEDATA}/${profileId}`);
  }

  editMethodMonitorData(data): Observable<MethodMonitorData> {
    let url = `${URL.EDIT_ROW_METHOD_MONITOR_URL}/${data.methodId}`
    return this._restApi.getDataByPutReq(url, data);
  }
  addMethodMonitorData(data, profileId): Observable<MethodMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_METHOD_MONITOR}/${profileId}`, data);
  }

  deleteMethodMonitorData(data): Observable<MethodMonitorData> {
    return this._restApi.getDataByPostReq(URL.DEL_METHOD_MONITOR, data);
  }

  getListOfXmlFiles(profileId):Observable<string[]>{
    return this._restApi.getDataByGetReq(URL.GET_INSTR_PROFILE_LIST)
  }


}
