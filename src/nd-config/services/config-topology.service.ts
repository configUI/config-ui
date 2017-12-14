import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { ConfigRestApiService } from './config-rest-api.service';
import { TopologyInfo, TierInfo, ServerInfo, InstanceInfo, AutoInstrSettings, AutoIntrDTO } from '../interfaces/topology-info';
import { TreeNode } from 'primeng/primeng';

import * as URL from '../constants/config-url-constant';
import { ConfigUtilityService } from './config-utility.service';

@Injectable()
export class ConfigTopologyService {

  private _topoTreeData: Object;

  private _tableData: Object;


  public get tableData(): Object {
    return this._tableData;
  }

  public set tableData(value: Object) {
    this._tableData = value;
  }

  public get topoTreeData(): Object {
    return this._topoTreeData;
  }

  public set topoTreeData(value: Object) {
    this._topoTreeData = value;
  }



  constructor(private _restApi: ConfigRestApiService, private configUtilityService: ConfigUtilityService) { }

  getTopologyList(): Observable<TopologyInfo[]> {
    return this._restApi.getDataByGetReq(URL.FETCH_ALL_TOPODATA);
  }

  /** fetch topology table data*/
  getTopologyDetail(dcId: number): Observable<TopologyInfo[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_TOPO_TABLE_URL}/${dcId}`);
  }

  getTierDetail(topoId: number, entity: TopologyInfo): Observable<TierInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_TIER_TABLE_URL}/${topoId}`, entity);
  }

  getServerDetail(tierId: number, entity: TierInfo): Observable<ServerInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_SERVER_TABLE_URL}/${tierId}`, entity);
  }

  getInstanceDetail(serverId: number, entity: ServerInfo): Observable<InstanceInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.FETCH_INSTANCE_TABLE_URL}/${serverId}`, entity);
  }

  getTopologyTreeDetail(dcId: number): Observable<TreeNode[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_TOPO_TREE_URL}/${dcId}`);
  }

  getTierTreeDetail(tierId: number, profileId: number): Observable<TreeNode[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_TIER_TREE_URL}/${tierId}/${profileId}`);
  }

  getServerTreeDetail(serverId: number, profileId: number): Observable<TreeNode[]> {
    return this._restApi.getDataByGetReq(`${URL.FETCH_SERVER_TREE_URL}/${serverId}/${profileId}`);
  }


  getTierTableData(tierId: number, profileId: number) {
    this._restApi.getDataByGetReq(`${URL.FETCH_TIER_TABLE_URL}/${tierId}/{profileId}`).subscribe(data => this._tableData = data)
  }

  /* Changing Profile To Topology */
  updateAttachedProfTopo(data): Observable<Object> {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TOPO}/${data.dcTopoId}/${data.profileId}`);
  }

  /* Changing Profile to Tier */
  updateAttachedProfTier(data) {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TIER}/${data.tierId}/${data.profileId}`);
  }
  /* Changing Profile to Server */
  updateAttachedProfServer(data) {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_SERVER}/${data.serverId}/${data.profileId}`);
  }

  /* Changing Profile to Instance */
  updateAttachedProfInstance(data) {
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_INSTANCE}/${data.instanceId}/${data.profileId}`);
  }

  /**For disable Profile at instance level */
  disableProfInstance(instanceId, flag) {
    return this._restApi.getDataByPutReq(`${URL.TOGGLED_INSTANCE_STATE}/${instanceId}/${flag}`);
  }

  getTopologyStructure(topoId) {
    return this._restApi.getDataByGetReq(`${URL.TOPOLOGY_TREE_STRUCTURE}/${topoId}`);
  }

  getTopologyStructureTableData(topoId) {
    return this._restApi.getDataByGetReq(`${URL.TOPOLOGY_STRUCT_TABLEDATA}/${topoId}`);
  }

  getLazyFiles() {
    let data = {
      "data":
      [
        { "label": "Expenses.doc", "icon": "fa-file-word-o", "data": "Expenses Document" }, { "label": "Resume.doc", "icon": "fa-file-word-o", "data": "Resume Document" }
      ]
    };
    return data.data;
  }

  /**To apply auto-instrumentation  */
  applyAutoInstr(data): Observable<AutoIntrDTO> {
    return this._restApi.getDataByPostReq(`${URL.APPLY_AUTO_INSTR}`, data);
  }

  /**To apply auto-instrumentation  */
  stopAutoInstr(instanceName): Observable<AutoIntrDTO[]> {
    return this._restApi.getDataByPostReq(`${URL.STOP_AUTO_INSTR}`, instanceName);
  }

  /**To get auto-instrumentation settings data to display in dialog */
  getAutoInstr(appName, instanceName, sessionName) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_AUTO_INSTR_DATA}/${appName}`, instanceName + "#" + sessionName);
  }

  getServerDisplayName(instanceId: number): Observable<String> {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_SERVER_DIS_NAME}/${instanceId}`);
  }


  //Send RTC on AI(running mode)
  sendRTCAutoInstr(url, data, autoInstrDto, callback) {
    let success = ""
    this._restApi.getDataByPostReq(url, data).subscribe(data => {

      //When result=OK
      if (data[0].includes("result=OK") || data[0].includes("result=Ok")) {

        //Request to save in database if NDC sends OK
        this.applyAutoInstr(autoInstrDto).subscribe(data => {
          this.configUtilityService.infoMessage("Auto Instrumentation started");
          success = "success";
          callback(success)
        })
      }

      //When result=Error, then no RTC applied
      else {
        //Getting error if any and showing as toaster message
        let err = data[0].substring(data[0].lastIndexOf(":") + 1)
        if (err.includes("action=modify;result=Error;"))
          this.configUtilityService.errorMessage("Could not start: This instance is not connected");
        else
          this.configUtilityService.errorMessage("Could not start: " + err);

        success = "fail";
        callback(success)
      }
    });
  }

  //Send RTC on AI(Stop mode)
  sendRTCTostopAutoInstr(url, data, instanceName, sessionName, callback) {
    this._restApi.getDataByPostReq(url, data).subscribe(data => {

      //When result=OK
      if (data[0].includes("result=OK") || data[0].includes("result=Ok")) {

        //Merging instane name and session name with &
        let ISName = instanceName + "&" + sessionName
        //Request to change the status of instance from "In progress to complete" if NDC sends OK
        this.stopAutoInstr(ISName).subscribe(data => {
          this.configUtilityService.infoMessage("Auto Instrumentation terminated");
          callback(data)
        })
      }

      //When result=Error, then no RTC applied
      else {
        //Getting error if any and showing as toaster message
        let err = data[0].substring(data[0].lastIndexOf("result=Error;") + 1)
        this.configUtilityService.errorMessage("Could not stop: " + err);
        callback(data);
      }
    });
  }

  //Get Auto Instrumentation Data to show  in table
  getAIData(): Observable<AutoIntrDTO[]> {
    return this._restApi.getDataByGetReq(`${URL.GET_AUTO_INSTR_TABLE_DATA}`);
  }

  //Update AI details when duration is completed
  updateAIDetails(): Observable<AutoIntrDTO[]> {
    return this._restApi.getDataByGetReq(`${URL.UPDATE_AI_DETAILS}`);
  }


  //Get Auto Instrumentation Data to show  in table
  getSessionFileExistOrNot(sessionFileName) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.FILE_EXIST_OR_NOT}`, sessionFileName);
  }

  //Get status of the selected AI
  getAIStatus(instance) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.GET_AI_STATUS}`, instance);
  }

  //Download File after AI
  downloadFile(data) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.DOWNLOAD_FILE}`, data);
  }

  //Update AI enable in Instance table
  updateAIEnable(instanceId, flag) {
    return this._restApi.getDataByPostReqWithNoJSON(`${URL.UPDATE_AI_ENABLE}/${instanceId}`, flag);
  }

  //Update AI enable in Instance table and AI status from In progress to complete when duration for AI is completed
  durationCompletion() {
    return this._restApi.getDataByGetReqWithNoJson(`${URL.DURATION_OVER_UPDATION}`);
  }

  deleteTopology(ids: number[]): Observable<TopologyInfo[]> {
    return this._restApi.getDataByPostReq(`${URL.DELETE_TOPOLOGY}`, ids);
  }

}
