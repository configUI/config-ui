import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo,TierInfo,ServerInfo,InstanceInfo } from '../../interfaces/topology-info';
import * as CONS from '../../constants/config-constant';

@Component({
  selector: 'app-config-tree-detail',
  templateUrl: './config-tree-detail.component.html',
  styleUrls: ['./config-tree-detail.component.css']
})
export class ConfigTreeDetailComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService, private route: ActivatedRoute) { }

  topologyData: any[];
  tableHeaderInfo: any[];
  currentEntity: string = CONS.TOPOLOGY.TOPOLOGY;
  topologyEntity:TopologyInfo;
  tierEntity :TierInfo;
  serverEntity:ServerInfo;
  instanceEntity:InstanceInfo
  

  ngOnInit() {
    this.loadTopologyData();
  }

  loadTopologyData(): void {
    this.getTableHeader();
    this.route.params.switchMap((params: Params) => this.configTopologyService.getTopologyDetail(+params['dcId'])).subscribe(data => this.topologyData = data);
  }

  /** For getting entity(Tier, Server, Instance) data  **/
  
  getData(event): void {

    if (event.data.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
      this.currentEntity = CONS.TOPOLOGY.TIER;
      this.topologyData.filter(row => {if(row.topoId == event.data.nodeId)  this.topologyEntity= row})
      this.configTopologyService.getTierDetail(event.data.nodeId, this.topologyEntity).subscribe(data => this.topologyData = data);
    }
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER) {
      this.currentEntity = CONS.TOPOLOGY.SERVER;
       this.topologyData.filter(row => {if(row.tierId == event.data.nodeId)  this.tierEntity= row})
      this.configTopologyService.getServerDetail(event.data.nodeId, this.tierEntity).subscribe(data => this.topologyData = data);
    }
    else if (event.data.currentEntity == CONS.TOPOLOGY.SERVER) {
      this.currentEntity = CONS.TOPOLOGY.INSTANCE;
      this.topologyData.filter(row => {if(row.serverId == event.data.nodeId)  this.serverEntity= row})
      this.configTopologyService.getInstanceDetail(event.data.nodeId, this.serverEntity).subscribe(data => this.topologyData = data);
    }
    //For Table header Name
    this.getTableHeader();
  }

  /**For Display table header object */
  getTableHeader(): void{
    let tableHeaderInfo = [];

    //Default for topology detail
    let colField;
    let colHeader = ["Name", "Description", "Profile Applied"];
    if(this.currentEntity == CONS.TOPOLOGY.TOPOLOGY){
      colField = ["topoName", "topoDesc", "profileName"];
    }
   
    else if (this.currentEntity == CONS.TOPOLOGY.TIER) {
      colField = ["tierName", "tierDesc", "profileName"];
    }
    else if (this.currentEntity == CONS.TOPOLOGY.SERVER) {
      colField = ["serverDisplayName", "serverDesc", "profileName"];
    }
    else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {
      colField = ["instanceDisplayName", "instanceDesc", "profileName", "enabled"];
      colHeader.push("Enabled");
    }

    for(let i = 0; i < colField.length; i++){
      tableHeaderInfo.push({field: colField[i], header: colHeader[i]});
    }

    this.tableHeaderInfo = tableHeaderInfo;
  }
}
