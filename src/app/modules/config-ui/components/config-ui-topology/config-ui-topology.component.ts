import { Component, OnInit } from '@angular/core';

import { ConfigUiDataService } from '../../services/config-ui-data.service';

import { TierData } from '../../containers/tier-data';
import { TIER_DETAIL } from '../../constants/cofig-ui-field-header-mapping'

@Component({
  selector: 'app-config-ui-topology',
  templateUrl: './config-ui-topology.component.html',
  styleUrls: ['./config-ui-topology.component.css']
})
export class ConfigUiTopologyComponent implements OnInit {

  constructor(private configUiDataService: ConfigUiDataService) { }

  tierData: TierData[];
  cols = TIER_DETAIL;
  
  ngOnInit() {  
    this.loadTierDetail();
  }

  loadTierDetail(){
    this.configUiDataService.getTierDetail().subscribe(data=> {
      this.tierData = data;
    },
    err => {
      console.error(err);
    });
  }
}
