import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo } from '../../interfaces/topology-info';
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

  ngOnInit() {
    this.loadTopologyData();
  }

  loadTopologyData(): void {
    this.getTableHeader();
    this.route.params.switchMap((params: Params) => this.configTopologyService.getTopologyDetail(+params['dcId'])).subscribe(data => this.topologyData = data);
  }

  /**For getting entity(Tier, Server, Instance) data  */
  getData(id, entity?: any): void {
    if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
      this.currentEntity = CONS.TOPOLOGY.TIER;
      this.configTopologyService.getTierDetail(+id, entity).subscribe(data => this.topologyData = data);
    }
    else if (this.currentEntity == CONS.TOPOLOGY.TIER) {
      this.currentEntity = CONS.TOPOLOGY.SERVER;
      this.configTopologyService.getServerDetail(+id, entity).subscribe(data => this.topologyData = data);
    }
    else if (this.currentEntity == CONS.TOPOLOGY.SERVER) {
      this.currentEntity = CONS.TOPOLOGY.INSTANCE;
      this.configTopologyService.getInstanceDetail(+id, entity).subscribe(data => this.topologyData = data);
    }
    //For Table header Name
    this.getTableHeader();
  }

  /**For Display table header object */
  getTableHeader(): void{
    let tableHeaderInfo = [];

    //Default for topology detail
    let colField = ["topoName", "topoDesc", "profileName"];
    let colHeader = ["Name", "Description", "Profile Applied"];
    
    if (this.currentEntity == CONS.TOPOLOGY.TIER) {
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
