import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { TreeNode } from 'primeng/primeng';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo } from '../../interfaces/topology-info';
import * as CONS from '../../constants/config-constant';

@Component({
  selector: 'app-config-tree',
  templateUrl: './config-tree.component.html',
  styleUrls: ['./config-tree.component.css']
})
export class ConfigTreeComponent implements OnInit {


  @Output()
  getTableData = new EventEmitter();

  constructor(private configTopologyService: ConfigTopologyService, private route: ActivatedRoute) { }

  
  topologyTreeData:TopologyInfo[];
  files: TreeNode[];
    
  selectedFiles: TreeNode[];

  dcId: number;

  ngOnInit() {
    this.loadTopologyTreeData();
  }
  /*
  * Here request for tree where topology acts as root node gives response 
  * topology as root node and tiers as children
  * so when user clicks on topo node no nedd to request to sever to get all  tier childrens,
  * they are already present in tree but not visible tills its parent node topo is collapsed state.
  */

  loadTopologyTreeData(): void{
   
    this.route.params.subscribe((params: Params) => this.dcId = params['profileId']);
    this.route.params.subscribe((params: Params)=> {
         this.configTopologyService.getTopologyTreeDetail(+params['dcId']).subscribe(data => this.files = data)
     });
  }

  /*
   * This function is called when user expands any node
   */

  loadNode(event) {
    console.log("event", event);
    console.log("topo Id---",event.node)
     if(event.node.data == "Topology") {
        let data= {'currentEntity':CONS.TOPOLOGY.TOPOLOGY,'nodeId':event.node.id}
        this.getTableData.emit({data})
     }
     else if(event.node.data == "Tier") {
       this.configTopologyService.getTierTreeDetail(event.node.id,event.node.profileId).subscribe(nodes => event.node.children = nodes);
       let data= {'currentEntity':CONS.TOPOLOGY.TIER,'nodeId':event.node.id}
       this.getTableData.emit({data})
      }
    else if(event.node.data == "Server"){
      this.configTopologyService.getServerTreeDetail(event.node.id,event.node.profileId).subscribe(nodes => event.node.children = nodes);
      let data= {'currentEntity':CONS.TOPOLOGY.SERVER,'nodeId':event.node.id}
      this.getTableData.emit({data})
    }
    }
}
