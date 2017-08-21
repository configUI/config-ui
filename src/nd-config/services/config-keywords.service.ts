import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { ConfigRestApiService } from './config-rest-api.service';
import * as URL from '../constants/config-url-constant';
import { KEYWORD_DATA } from '../reducers/keyword-reducer';

import { BusinessTransGlobalInfo } from '../interfaces/business-Trans-global-info';
// import { BusinessTransPatternInfo } from '../interfaces/business-trans-pattern-info';
import { BusinessTransMethodInfo } from '../interfaces/business-trans-method-info';


import { BusinessTransMethodData, BusinessTransPatternData, SessionAtrributeComponentsData, HTTPRequestHdrComponentData, RulesHTTPRequestHdrComponentData, AddIPDetection } from '../containers/instrumentation-data';
import { ServiceEntryPoint, IntegrationPT,EndPoint, ErrorDetection, MethodMonitorData, NamingRuleAndExitPoint, HttpStatsMonitorData, BTHTTPHeaderData, ExceptionMonitor, ExceptionMonitorData } from '../containers/instrumentation-data';
import { GroupKeyword } from '../containers/group-keyword';

import { BackendInfo, ServiceEntryType } from '../interfaces/instrumentation-info';
import { httpReqHeaderInfo } from '../interfaces/httpReqHeaderInfo';
import { ConfigUtilityService } from '../services/config-utility.service';
import { Messages, customKeywordMessage } from '../constants/config-constant'


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

  private keywordGroupSubject = new Subject<GroupKeyword>();

  keywordGroupProvider$ = this.keywordGroupSubject.asObservable();

  /**For Configuration Screen-
   * Handled Toggle Button and Enable/Disable keyword information.
   */
  keywordGroup: GroupKeyword = {
    general: { flowpath: { enable: false, keywordList: ["bciInstrSessionPct", "enableCpuTime", "enableForcedFPChain", "correlationIDHeader"] }, hotspot: { enable: false, keywordList: ["ASSampleInterval", "ASThresholdMatchCount", "ASReportInterval", "ASDepthFilter", "ASTraceLevel", "ASStackComparingDepth"] }, thread_stats: { enable: false, keywordList: ["enableJVMThreadMonitor"] }, exception: { enable: false, keywordList: ['instrExceptions'] }, header: { enable: false, keywordList: ["captureHTTPReqFullFp", "captureCustomData", "captureHTTPRespFullFp"] }, instrumentation_profiles: { enable: false, keywordList: ["instrProfile"] } },
    advance: {
      debug: { enable: false, keywordList: ['enableBciDebug', 'enableBciError', 'InstrTraceLevel', 'ndMethodMonTraceLevel'] }, delay: { enable: false, keywordList: ['putDelayInMethod'] },
      // backend_monitors: { enable: false, keywordList: ['enableBackendMonitor'] },
      generate_exception: { enable: false, keywordList: ['generateExceptionInMethod'] },
      monitors: { enable: false, keywordList: ["enableBTMonitor", "enableBackendMonitor"] }
    },
    product_integration: { nvcookie: { enable: false, keywordList: ["enableNDSession"] } }
  }

  constructor(private _restApi: ConfigRestApiService, private store: Store<Object>, private configUtilityService: ConfigUtilityService) { }

  /** For Getting all keywordData data */
  getProfileKeywords(profileId) {
    this._restApi.getDataByGetReq(`${URL.GET_KEYWORDS_DATA}/${profileId}`)
      .subscribe(data => {
        this.keywordData = data;
        // Calling toggleKeywordData for set enable/disabled keyword group data.
        this.toggleKeywordData();
        this.store.dispatch({ type: KEYWORD_DATA, payload: data });
      });
  }

  /** For save all keywordData data */
  saveProfileKeywords(profileId, toggle?: string) {
    this._restApi.getDataByPostReq(`${URL.UPDATE_KEYWORDS_DATA}/${profileId}`, this.keywordData)
      .subscribe(data => {
        this.keywordData = data;
        if (toggle != "toggle")
          this.configUtilityService.successMessage(Messages);

        this.store.dispatch({ type: KEYWORD_DATA, payload: data });
      });
  }


  /**
 * This method is used to enable/disable toggle button.
 */
  toggleKeywordData() {
    let data = this.keywordData;

    //First time doesn't have keyword data then we return default keyword group data.
    if (!data)
      return this.keywordGroup;

    //moduleName -> general, advance, product_integration, instrumentation
    for (let moduleName in this.keywordGroup) {

      //keywordGroupList -> { flowpath: { enable: false, keywordList: ["k1", "k2"]}, hotspot: { enable: false, keywordList: ["k1", "k2"] }, ....}
      let keywordGroupList = this.keywordGroup[moduleName];

      //keywordKey -> flowpath, hotspot...
      for (let keywordKey in keywordGroupList) {

        //keywordInfo -> { enable: false, keywordList: ["k1", "k2"]}
        let keywordInfo = keywordGroupList[keywordKey];

        //keywordList -> ["k1", "k2"]
        let keywordList = keywordInfo.keywordList;

        for (let i = 0; i < keywordList.length; i++) {
          //If group of keywords value is not 0 that's means groupkeyword is enabled.
          if (data[keywordList[i]].value != 0 || data[keywordList[i]].value != "0") {
            //Enabling groupkeyword
            keywordInfo.enable = true;
          }
        }
      }
    }
    this.keywordGroupSubject.next(this.keywordGroup);
    //Updating groupkeyword values after reading keyword data object.
    //this.keywordGroup = this.configKeywordsService.keywordGroup;
  }

  /** Config-nd File explorer */
  private fileList = new Subject();
  fileListProvider = this.fileList.asObservable();

  updateFileList(fileList) {
    this.fileList.next(fileList);
  }

  /**Service Entry Point */
  getServiceEntryPointList(profileId): Observable<ServiceEntryPoint[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SERVICE_POINTS_TABLEDATA}/${profileId}`);
  }

  /**For getting Entry Point Type List */
  getEntryPointTypeList(): Observable<ServiceEntryType[]> {
    return this._restApi.getDataByGetReq(URL.FETCHING_SERVICE_ENTRYPOINTS_FORM);
  }

  /**Service Entry Point */
  enableServiceEntryPointList(serviceEntryId, isEnable): Observable<ServiceEntryPoint[]> {
    return this._restApi.getDataByPostReq(`${URL.ENABLE_SERVICE_ENTRY_POINTS}/${serviceEntryId}/${isEnable}`);
  }

  addServiceEntryPointData(data, profileId): Observable<ServiceEntryPoint> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_SERVICE_ENTRY_POINTS}/${profileId}`, data);
  }

  deleteServiceEntryData(data, profileId): Observable<ServiceEntryPoint> {
    return this._restApi.getDataByPostReq(`${URL.DEL_SERVICE_ENTRY_POINTS}/${profileId}`, data);
  }

  editServiceEntryPointData(data, profileId): Observable<ServiceEntryPoint> {
    let url = `${URL.EDIT_SERVICE_ENTRY_POINTS}/${profileId}/${data.id}`
    return this._restApi.getDataByPutReq(url, data);
  }

  /**For Integration PT Detection */
  getIntegrationPTDetectionList(profileId): Observable<IntegrationPT[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BACKEND_TABLEDATA}/${profileId}`);
  }

  deleteIntegrationPointData(data, profileId): Observable<EndPoint> {
    return this._restApi.getDataByPostReq(`${URL.DEL_INTEGRATION_POINTS}/${profileId}`, data);
  }

  getBackendList(profileId): Observable<BackendInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BACKEND_TYPES}/${profileId}`);
  }

  addIntegrationPTDetectionData(profileId, data): Observable<AddIPDetection> {
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

  addErrorDetection(data, profileId): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_ERROR_DETECTION}/${profileId}`, data);
  }

  editErrorDetection(data, profileId): Observable<ErrorDetection> {
    let url = `${URL.EDIT_ERROR_DETECTION}/${profileId}/${data.errDetectionId}`
    return this._restApi.getDataByPutReq(url, data);
  }

  deleteErrorDetection(data, profileId): Observable<ErrorDetection> {
    return this._restApi.getDataByPostReq(`${URL.DEL_ERROR_DETECTION}/${profileId}`, data);
  }


  getExceptionMonitorList(profileId): Observable<ExceptionMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_EXCEPTION_MON_TABLEDATA}/${profileId}`);
  }

  editExceptionMonitorData(data, profileId): Observable<ExceptionMonitorData> {
    let url = `${URL.EDIT_ROW_EXCEPTION_MONITOR_URL}/${profileId}/${data.exceptionId}`
    return this._restApi.getDataByPutReq(url, data);
  }

  addExceptionMonitorData(data, profileId): Observable<ExceptionMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_EXCEPTION_MONITOR}/${profileId}`, data);
  }

  deleteExceptionMonitorData(data, profileId): Observable<ExceptionMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_EXCEPTION_MONITOR}/${profileId}`, data);
  }

  getMethodMonitorList(profileId): Observable<MethodMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_METHOD_MON_TABLEDATA}/${profileId}`);
  }

  editMethodMonitorData(data, profileId): Observable<MethodMonitorData> {
    let url = `${URL.EDIT_ROW_METHOD_MONITOR_URL}/${profileId}/${data.methodId}`
    return this._restApi.getDataByPutReq(url, data);
  }

  addMethodMonitorData(data, profileId): Observable<MethodMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_METHOD_MONITOR}/${profileId}`, data);
  }

  deleteMethodMonitorData(data, profileId): Observable<MethodMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_METHOD_MONITOR}/${profileId}`, data);
  }

  getListOfXmlFiles(profileId): Observable<string[]> {
    return this._restApi.getDataByGetReq(URL.GET_INSTR_PROFILE_LIST)
  }

  /*  FETCH SESSION ATTRIBUTE TABLEDATA
   */

  getFetchSessionAttributeTable(profileId): Observable<SessionAtrributeComponentsData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SESSION_ATTR_TABLEDATA}/${profileId}`);
  }

  deleteSessionAttributeData(data): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_SESSION_ATTR}`, data)
  }

  addSessionAttributeData(data, profileId): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_SPECIFIC_ATTR}/${profileId}`, data);
  }

  getSessionAttributeValue(data, profileId): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_SESSION_TYPE}/${profileId}`, data);
  }

  editSessionAttributeData(data): Observable<SessionAtrributeComponentsData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_SESSION_ATTR}/${data.sessAttrId}`, data)
  }


  //HTTP Stats Monitors

  addHttpStatsMonitorData(data, profileId): Observable<HttpStatsMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_HTTP_STATS_COND}/${profileId}`, data);
  }

  getHttpStatsMonitorList(profileId): Observable<HttpStatsMonitorData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_HTTP_STATS_COND_TABLEDATA}/${profileId}`);
  }

  editHttpStatsMonitorData(data, profileId): Observable<HttpStatsMonitorData> {
    let url = `${URL.EDIT_ROW_HTTP_STATS_MONITOR_URL}/${profileId}/${data.hscid}`
    return this._restApi.getDataByPutReq(url, data);
  }

  deleteHttpStatsMonitorData(data, profileId): Observable<HttpStatsMonitorData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_STATS_COND}/${profileId}`, data);
  }


  /**
  *  Business Transaction Service
  *
  */

  /* Fetch  Business Trans Global Info */
  getBusinessTransGlobalData(profileId): Observable<BusinessTransGlobalInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BT_GLOBAL_DATA}/${profileId}/bussinessTransGlobal`);
  }

  /* Fetch  Business Trans Pattern Info */
  getBusinessTransPatternData(profileId): Observable<BusinessTransPatternData[]> {
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
  editBusinessTransMethod(data): Observable<BusinessTransMethodData> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_BTMETHOD}/${data.btMethodId}`, data);
  }

  /*Add Pattern Bt Data*/
  addBusinessTransPattern(data, profileId): Observable<BusinessTransPatternData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_NEW_BT_PATTERN_DETAILS}/${profileId}`, data);
  }

  /*EDIT Pattern Bt Data*/
  editBusinessTransPattern(data, profileId): Observable<BusinessTransPatternData> {
    let url = `${URL.EDIT_BT_PATTERN_TABLEDATA}/${profileId}/${data.id}`;
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

  /*  FETCH HTTP REQUEST HEADER TABLEDATA */
  getFetchHTTPReqHeaderTable(profileId): Observable<httpReqHeaderInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_HTTPREQ_HDR}/${profileId}`);
  }

  /* delete  Business Trans Method Info */
  deleteHTTPReqHeaderData(data, profileId): Observable<HTTPRequestHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_REQ_HDR}`, data);
  }

  /* Fetch  Business Trans Method Info */
  addHTTPReqHeaderData(data, profileId): Observable<HTTPRequestHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.ADD_HTTP_REQ_HDR}/${profileId}`, data);
  }

  /** get the HTTP Request Header Type */
  getHTTPRequestValue(data, profileId): Observable<HTTPRequestHdrComponentData> {
    return this._restApi.getDataByPostReq(`${URL.UPDATE_HTTP_REQ_TYPE}/${profileId}`, data);
  }

  // /* Edit  Business Trans Method Info */
  // editHTTPReqHeaderData(data, profileId): Observable<HTTPRequestHdrComponentData> {
  //   let url = `${URL.UPDATE_HTTPREQHDR}/${profileId}`;
  //   return this._restApi.getDataByPostReq(url, data);
  // }

  // /* Edit  Business Trans Method Info */
  // editHTTPReqHeaderRulesData(data, ReqId): Observable<RulesHTTPRequestHdrComponentData> {
  //   let url = `${URL.ADD_RULES_HTTPREQHDR}/${ReqId}`;
  //   return this._restApi.getDataByPostReq(url, data);
  // }

  //Need more testing.
  sendRunTimeChange(URL, data) {
    this._restApi.getDataByPostReq(URL, data).subscribe(
      data => {
        //When runtime changes are applied
        this.configUtilityService.infoMessage("Runtime changes applied");
      },
      error => {
        //When runtime changes are not applied
        this.configUtilityService.errorMessage("Error : See the agent logs");
      }
    );
  }

  deleteSpecificAttrValues(listOfIDs) {
    let url = `${URL.DELETE_ATTR_RULES}`;
    return this._restApi.getDataByPostReq(url, listOfIDs);
  }

  /* Delete Http Request Header Rules  */
  deleteHttpRules(data) {
    return this._restApi.getDataByPostReq(`${URL.DELETE_HTTPREQHDR_RULES}`, data);
  }

  /* Edit Http Request Header Info */
  editHTTPReqHeaderData(data): Observable<HTTPRequestHdrComponentData> {
    let url = `${URL.UPDATE_HTTPREQHDR}/${data.httpAttrId}`;
    return this._restApi.getDataByPostReq(url, data);
  }

  //  / Delete Method Bt Rules  /
  deleteMethodBtRules(listOfIds) {
    return this._restApi.getDataByPostReq(`${URL.DEL_METHOD_RULES_BT}`, listOfIds);
  }



  /** Add BT HTTP REQUEST HEADERS */
  addBtHttpHeaders(data, profileId) {
    return this._restApi.getDataByPostReq(`${URL.ADD_BT_HTTP_HDR_URL}/${profileId}`, data);
  }
  /** Get all BT Http header data */
  getBTHttpHdrData(profileId): Observable<BTHTTPHeaderData[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_BTHTTP_HDR_URL}/${profileId}`);
  }

  /** Delete BT HTTP headers Info */
  deleteBTHTTPHeaders(data, profileId): Observable<BTHTTPHeaderData> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_BT_HDR}/${profileId}`, data);
  }

  /** Delete HTTP Headers Conditions  */
  deleteHTTPHdrConditions(listOfIds) {
    return this._restApi.getDataByPostReq(`${URL.DEL_HTTP_HDR_COND}`, listOfIds);
  }

  /* Edit  BT HTTP Headers Info */
  editBTHTTPHeaders(data): Observable<BTHTTPHeaderData> {
    return this._restApi.getDataByPostReq(`${URL.EDIT_BTHTTP_HEADER}/${data.headerId}`, data);
  }

  /** Method to upload file */
  uploadFile(filePath, profileId) {
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_FILE}/${profileId}`, filePath);
  }

  /** Method to upload file method monitors file */
  uploadMethodMonitorFile(filePath, profileId) {
    return this._restApi.getDataByPostReq(`${URL.UPLOAD_METHOD_MONITOR_FILE}/${profileId}`, filePath);
  }

  /** Method to copy selected xml files in instrProfiles */
  copyXmlFiles(filesWithPath, profileId): Observable<string[]> {
    return this._restApi.getDataByPostReq(`${URL.COPY_XML_FILES}/${profileId}`, filesWithPath);
  }

  /** Get file path */
  getFilePath(profileId): Observable<string> {
    return this._restApi.getDataByGetReqWithNoJson(`${URL.GET_FILE_PATH}/${profileId}`);

  }
  /*this method is used for get selected text instrumnetation profile in xml format*/
  getInstrumentationProfileXMLData(data) {
    return this._restApi.getXMLDataByPostReq(`${URL.GET_IMPORT_INSTRUMENT_PROFILE_XML}`, data);
  }

  /*this method is used for get all xml files for a particular path*/
  getInstrumentationProfileXMLFileList() {
    return this._restApi.getDataByGetReq(`${URL.GET_XML_INSTRUMENT_PROFILE}`);
  }

  /*this method is used for get selected xml instrumnetation profile in xml format*/
  getXMLDataFromSelectedXMLFile(data) {
    return this._restApi.getXMLDataByPostReq(`${URL.GET_XML_DATA_FROM_SELECTED_XML_FILE}`, data);
  }
}
