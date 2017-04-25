import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationInfo } from '../../interfaces/application-info';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigProfileService } from '../../services/config-profile.service'
import { ConfigApplicationService } from '../../services/config-application.service';
import { ConfigUtilityService } from '../../services/config-utility.service';

import { MainInfo } from '../../interfaces/main-info';
import { EntityInfo } from '../../interfaces/entity-info';
import { NDAgentInfo } from '../../interfaces/nd-agent-info';
import { ROUTING_PATH } from '../../constants/config-url-constant';

@Component({
  selector: 'app-config-home',
  templateUrl: './config-home.component.html',
  styleUrls: ['./config-home.component.css']
})
export class ConfigHomeComponent implements OnInit {

  /**It stores application Info */
  applicationInfo: EntityInfo[];
  /**It stores topology Info */
  topologyInfo: EntityInfo[];
  /**It stores profile Info */
  profileInfo: EntityInfo[];
  // It stores all the information regarding ND agents
  agentsInfo: NDAgentInfo[];
  //For showing import technologies dialog
  importTopo: boolean = false;
  ROUTING_PATH = ROUTING_PATH;
  constructor(private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService, private configProfileService: ConfigProfileService, private configApplicationService: ConfigApplicationService, private router: Router) { }

  ngOnInit() {
    this.loadHomeData();
  }

  /**Getting topology list , application list and profile list. */
  loadHomeData(): void {
    this.configHomeService.getMainData()
      .subscribe(data => {

      if(data.homeData[0].value.length > 5)
        {
             this.applicationInfo = (data.homeData[0].value).slice(data.homeData[0].value.length-5 , data.homeData[0].value.length ).reverse();
        }
      else
        {
             this.applicationInfo = (data.homeData[0].value).splice(0, data.homeData[0].value.length).reverse();
        }

      if(data.homeData[1].value.length > 5)
        {
             this.profileInfo = (data.homeData[1].value).slice(data.homeData[1].value.length-5, data.homeData[1].value.length).reverse();
        }

      else
        {
             this.profileInfo = (data.homeData[1].value).splice(0,data.homeData[1].value.length).reverse();
        }
        this.topologyInfo = (data.homeData[2].value).slice(0, 6);
        this.agentsInfo = data.agentData;
        data.trData.switch = data.trData.status == 'running';
        this.configHomeService.setTrData(data.trData);
        this.configHomeService.trData = data.trData;
      })
  }

  importTopologyDialog() {
    this.importTopo = true;
  }

  importTopology(): void {
    this.configHomeService.importTopology().subscribe(data => {
      this.topologyInfo = data;
      this.configUtilityService.infoMessage("Topologies imported successfully");
    });
    this.importTopo = false;
  }

  routeToTreemain(selectedApplicationId, selectedApplicationName) {
    //Observable application name
    this.configApplicationService.applicationNameObserver(selectedApplicationName);
    this.router.navigate([this.ROUTING_PATH + '/tree-main', selectedApplicationId]);
  }

  routeToConfiguration(selectedProfileId, selectedProfileName) {
    //Observable profile name
    this.configProfileService.profileNameObserver(selectedProfileName);
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  }

}
