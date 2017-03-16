import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SelectItem, TreeNode } from 'primeng/primeng';

import { ConfigUiDataService } from '../../services/config-ui-data.service';
import { ConfigUiMainDataService } from '../../services/config-ui-main-data.service';

import { TopologyData } from '../../containers/topology-data';
import { DcInfo } from '../../interfaces/dc-info';
import { TOPOLOGY_DETAIL } from '../../constants/cofig-ui-field-header-mapping'

@Component({
  selector: 'app-config-ui-topology-detail',
  templateUrl: './config-ui-topology-detail.component.html',
  styleUrls: ['./config-ui-topology-detail.component.css']
})
export class ConfigUiTopologyDetailComponent implements OnInit {

  constructor(private configUiDataService: ConfigUiDataService, private configUiMainDataService: ConfigUiMainDataService) { }

  private className: string = "ConfigUiTopologyDetailComponent";
  private topologyDetail: TopologyData[];
  private cols = TOPOLOGY_DETAIL();
  private profileList: SelectItem[];
  private entityData: TreeNode[];

  ngOnInit() {
    this.loadTopologyData();
    this.loadProfileList();
  }


  loadTopologyData(): void {
    //For getting table data
    this.configUiDataService.getTopologyDetail().subscribe(
      data => this.topologyDetail = data,
      err => console.error(this.className, "loadTopologyData", err)
    )

    //For getting tree data
    this.configUiDataService.getTopologyTreeData().subscribe(
      data =>{
        this.entityData = data
        console.log("this.entityData", this.entityData);
      } 
    )
  };

  loadProfileList() {
    this.configUiMainDataService.getMainData().subscribe(data => {
      //Getting Profile Data
      this.setProfileList(data.homeData[1].value);
    })
  };

  //Creating dropdown for ProfileList/
  setProfileList(data: DcInfo[]) {
    this.profileList = [];
    for (let index in data) {
      this.profileList.push({ label: data[index].name, value: data[index].id });
    }
  }

  
  loadNode(event) {
    console.log(this.className, "loadNode", event);
    if (event.node) {
      //in a real application, make a call to a remote url to load children of the current node and add the new nodes as children

       this.configUiDataService.getTopologyTreeData().subscribe(
      data => {
        
        let mm = [{"label": "Lazy Node 1",
            "data": "Node 2",
            "expandedIcon": "fa-folder-open",
            "collapsedIcon": "fa-folder",
            "leaf": false}, {"label": "Lazy Node 1",
            "data": "Node 2",
            "expandedIcon": "fa-folder-open",
            "collapsedIcon": "fa-folder",
            "leaf": false}, {"label": "Lazy Node 1",
            "data": "Node 2",
            "expandedIcon": "fa-folder-open",
            "collapsedIcon": "fa-folder",
            "leaf": false}];
        event.node.children = data;
        console.log("this.entityData ** ", data);
        console.log("this.entityData mm** ", mm);
        console.log("event.node", event.node);
      }
    )
      

    }
  }


}
