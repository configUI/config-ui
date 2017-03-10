import { Component, OnInit } from '@angular/core';
import { ConfigUiDataService } from '../../services/config-ui-data.service';
import { ConfigUiMainDataService } from '../../services/config-ui-main-data.service';
import { TopologyData } from '../../containers/topology-data';
import { TOPOLOGY_DETAIL } from '../../constants/cofig-ui-field-header-mapping'

@Component({
  selector: 'app-config-ui-main',
  templateUrl: './config-ui-main.component.html',
  styleUrls: ['./config-ui-main.component.css']
})
export class ConfigUiMainComponent implements OnInit {

  constructor(private configUiDataService: ConfigUiDataService, private configUiMainDataService: ConfigUiMainDataService) { }

  ngOnInit() {
    this.loadMainData();
  }

  loadMainData(){
    this.configUiMainDataService.getMainData().subscribe(data=> {

    });
  }

}
