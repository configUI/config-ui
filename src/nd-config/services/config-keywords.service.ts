import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { KEYWORD_DATA } from '../reducers/keyword-reducer';

import { BusinessTransGlobalInfo } from '../interfaces/business-Trans-global-info';
import { BusinessTransPatternInfo } from '../interfaces/business-trans-pattern-info';
import { BusinessTransMethodInfo } from '../interfaces/business-trans-method-info';
// import {  sessionAttributeInfo } from '../interfaces/sessionAttributeInfo';
import {  BusinessTransMethodData, BusinessTransPatternData , SessionAtrributeComponentsData} from '../containers/instrumentation-data';
import { ServiceEntryPoint, IntegrationPTDetection, ErrorDetection, MethodMonitorData, NamingRuleAndExitPoint, HttpStatsMonitorData } from '../containers/instrumentation-data';

import { BackendInfo } from '../interfaces/instrumentation-info';

@Injectable()
export class ConfigKeywordsService {

  /**It stores keyword data */
  private _keywordData: Object;

  public get keywordData(): Object {
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
        this.store.dispatch({ type: KEYWORD_DATA, payload: data });
      });
  }

  /** For save all keywordData data */
  saveProfileKeywords(profileId) {
    this._restApi.getDataByPostReq(`${URL.UPDATE_KEYWORDS_DATA}/${profileId}`, this.keywordData)
      .subscribe(data => {
        this.keywordData = data;
        this.store.dispatch({ type: KEYWORD_DATA, payload: data });
      });
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

  getBackendList(profileId): Observable<BackendInfo[]>{
    return this._restApi.getDataByGetReq(`${URL.FETCH_BACKEND_TYPES}/${profileId}`);
  }

  addIntegrationPTDetectionData(profileId, data): Observable<IntegrationPTDetection> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_BACKEND_POINT}/${profileId}`, data);
  }

  addIPNamingAndExit(profileId, backendId, data): Observable<NamingRuleAndExitPoint> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_BACKEND_POINT}/${profileId}/${backendId}`, data);
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

  /*  FETCH SESSION ATTRIBUTE TABLEDATA
   */
   getFetchSessionAttributeTable(profileId): Observable<SessionAtrributeComponentsData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SESSION_ATTR_TABLEDATA}/${profileId}`);
  }
  
  deleteSessionAttributeData(data): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_SESSION_ATTR}`,data) 
  }

  addSessionAttributeData(data, profileId): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_SPECIFIC_ATTR}/${profileId}`, data);
  }


  //HTTP Stats Monitors

   addHttpStatsMonitorData(data, profileId): Observable<HttpStatsMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_HTTP_STATS_COND}/${profileId}`, data);
  }

 getHttpStatsMonitorList(profileId): Observable<HttpStatsMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_HTTP_STATS_COND_TABLEDATA}/${profileId}`);
  }
  
  editHttpStatsMonitorData(data): Observable<HttpStatsMonitorData> {
    let url = `${URL.EDIT_ROW_HTTP_STATS_MONITOR_URL}/${data.methodId}`
    return this._restApi.getDataByPutReq(url, data);
  }

  deleteHttpStatsMonitorData(data,profileId): Observable<HttpStatsMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_STATS_COND}/${profileId}`,data);
  }

   /**
   *  Business Transaction Service
   * 
   */

  /* Fetch  Business Trans Global Info */
  getBusinessTransGlobalData(): Observable<BusinessTransGlobalInfo[]> {
    return this._restApi.getDataByGetReq(URL.FETCH_BT_GLOBAL_DATA);
  }

  /* Fetch  Business Trans Pattern Info */
  getBusinessTransPatternData(profileId): Observable<BusinessTransPatternInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BT_PATTERN_TABLEDATA}/${profileId}`);
  }

  /* Fetch  Business Trans Method Info */
  getBusinessTransMethodData(profileId): Observable<BusinessTransMethodData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BTMETHOD_URL}/${profileId}`);
  }

  /* Fetch  Business Trans Method Info */
  deleteBusinessTransMethodData(data, profileId): Observable<BusinessTransMethodInfo> {
    return this._restApi.getDataByPostReq(`${URL.DEL_METHOD_BT}/${profileId}`, data);
  }
  /* add  Business Trans Method Info */
  addBusinessTransMethod(data, profileId): Observable<BusinessTransMethodData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT_METHOD}/${profileId}`, data);
  }

  /* Edit  Business Trans Method Info */
   editBusinessTransMethod(data, profileId): Observable<BusinessTransMethodData> {
      return this._restApi.getDataByPostReq(`${URL.UPDATE_BTMETHOD}/${data.btMethodId}`, data);
  }


  /*Add Pattern Bt Data*/
  addBusinessTransPattern(data, profileId): Observable<BusinessTransPatternData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_BT_PATTERN_DETAILS}/${profileId}`, data);
  }

  /*EDIT Pattern Bt Data*/
  editBusinessTransPattern(data , profileId): Observable<BusinessTransPatternData> {
    let url = `${URL.EDIT_BT_PATTERN_TABLEDATA}/${profileId}/${data.id}`
    return this._restApi.getDataByPutReq(url, data);
  }

 /*Add Pattern Bt Data*/
  addGlobalData(data, profileId): Observable<BusinessTransPatternData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT}/${profileId}`, data);
  }

  /*Add Pattern Bt Data*/
  deleteBusinessTransPattern(data, profileId): Observable<BusinessTransPatternData[]> {
    return this._restApi.getDataByPostReq(`${URL.DEL_BT_PATTERN_DETAILS}/${profileId}`, data);
  }
}
