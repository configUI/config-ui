import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SelectItem } from 'primeng/primeng';

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

  ngOnInit() {
    this.loadTopologyData();
    this.loadProfileList();
  }


  loadTopologyData(): void {
    this.configUiDataService.getTopologyDetail().subscribe(
      data => this.topologyDetail = data,
      err => console.error(this.className, "loadTopologyData", err)
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
      this.profileList.push({label: data[index].name, value: data[index].id});
    }
  }



}
