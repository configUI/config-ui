import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { ConfigRestApiService } from './config-rest-api.service';
import { TopologyInfo, TierInfo, ServerInfo, InstanceInfo } from '../interfaces/topology-info';
import { TreeNode } from 'primeng/primeng';

import * as URL from '../constants/config-url-constant';

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



  constructor(private _restApi: ConfigRestApiService) { }

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

  getTopologyTreeDetail(dcId: number) :Observable<TreeNode[]>{
     return  this._restApi.getDataByGetReq(`${URL.FETCH_TOPO_TREE_URL}/${dcId}`);
  }

  getTierTreeDetail(tierId:number,profileId:number) : Observable<TreeNode[]>{
    return this._restApi.getDataByGetReq(`${URL.FETCH_TIER_TREE_URL}/${tierId}/${profileId}`);
  }

  getServerTreeDetail(serverId:number,profileId:number) :Observable<TreeNode[]>{
     return this._restApi.getDataByGetReq(`${URL.FETCH_SERVER_TREE_URL}/${serverId}/${profileId}`);
  }


  getTierTableData(tierId:number,profileId:number){
    this._restApi.getDataByGetReq(`${URL.FETCH_TIER_TABLE_URL}/${tierId}/{profileId}`).subscribe(data => this._tableData = data)
  }

/* Changing Profile To Topology */
  updateAttachedProfTopo(data) :Observable<Object>{
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TOPO}/${data.dcTopoId}/${data.profileId}`);
  }

/* Changing Profile to Tier */
  updateAttachedProfTier(data){
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_TIER}/${data.tierId}/${data.profileId}`);
  }
  /* Changing Profile to Server */
  updateAttachedProfServer(data){
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_SERVER}/${data.serverId}/${data.profileId}`);
  }

  /* Changing Profile to Instance */
  updateAttachedProfInstance(data){
    return this._restApi.getDataByGetReq(`${URL.ATTACH_PROFTO_INSTANCE}/${data.instanceId}/${data.profileId}`);
  }

  /**For disable Profile at instance level */
  disableProfInstance(instanceId, flag){
    return this._restApi.getDataByPutReq(`${URL.TOGGLED_INSTANCE_STATE}/${instanceId}/${flag}`);
  }


  getLazyFiles(){
    let data = {
    "data": 
    [
     {"label": "Expenses.doc", "icon": "fa-file-word-o", "data": "Expenses Document"}, {"label": "Resume.doc", "icon": "fa-file-word-o", "data": "Resume Document"}
    ]
};
    return data.data;
  }

//   getFiles(){
//     let data = {
//     "data": 
//     [
//         {
//             "label": "Suman",
//             "expan  e432dedIcon": "fa-folder-open",
//             "collapsedIcon": "fa-folder",
//         },
//         {
//             "label": "Pictures",
//             "data": "Pictures Folder",
//             "expandedIcon": "fa-folder-open",
//             "collapsedIcon": "fa-folder",
//             "children": [
//                 {"label": "barcelona.jpg", "icon": "fa-file-image-o", "data": "Barcelona Photo"},
//                 {"label": "logo.jpg", "icon": "fa-file-image-o", "data": "PrimeFaces Logo"},
//                 {"label": "primeui.png", "icon": "fa-file-image-o", "data": "PrimeUI Logo"}]
//         },
//         {
//             "label": "Movies",
//             "data": "Movies Folder",
//             "expandedIcon": "fa-folder-open",
//             "collapsedIcon": "fa-folder",
//             "children": [{
//                     "label": "Al Pacino",
//                     "data": "Pacino Movies",
//                     "children": [{"label": "Scarface", "icon": "fa-file-video-o", "data": "Scarface Movie"}, {"label": "Serpico", "icon": "fa-file-video-o", "data": "Serpico Movie"}]
//                 },
//                 {
//                     "label": "Robert De Niro",
//                     "data": "De Niro Movies",
//                     "children": [{"label": "Goodfellas", "icon": "fa-file-video-o", "data": "Goodfellas Movie"}, {"label": "Untouchables", "icon": "fa-file-video-o", "data": "Untouchables Movie"}]
//                 }]
//         }
//     ]
// };
//     return data.data;
//   }

}
