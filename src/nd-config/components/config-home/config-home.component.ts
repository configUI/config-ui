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
import { ConfigUiUtility } from '../../utils/config-utility';
import { Observable, } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

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

  applicationMsg: string;
  profileInfoMsg: string;
  topologyInfoMsg: string;
  topologyList = [];
  selectedTopology: string;
  refreshIntervalTime = 60000;
 
  subscription: Subscription;
  constructor(private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService, private configProfileService: ConfigProfileService, private configApplicationService: ConfigApplicationService, private router: Router) { }

  ngOnInit() {
    this.loadHomeData();
    this.getTestInfoDetails()
    this.configHomeService.getAIStartStopOperationOnHome();
   
    let timer = Observable.timer(20000, this.refreshIntervalTime);
    this.subscription = timer.subscribe(t => this.getTestInfoDetails());
  }

  loadTopologyList(){
    this.configHomeService.getTopologyList().subscribe(data => {
      data = data.sort();
      this.topologyList = ConfigUiUtility.createListWithKeyValue(data, data);
    })
  }

  /**Getting topology list , application list and profile list. */
  loadHomeData(): void {
    this.configHomeService.getMainData()
      .subscribe(data => {
        if (data.homeData[0].value.length > 5) {
          this.applicationMsg = "(Last 5 Modified)";
          this.applicationInfo = (data.homeData[0].value).slice(data.homeData[0].value.length - 5, data.homeData[0].value.length).reverse();
        }
        else
          this.applicationInfo = (data.homeData[0].value).splice(0, data.homeData[0].value.length).reverse();

        if (data.homeData[1].value.length > 5) {
          this.profileInfoMsg = "(Last 5 Modified)";
	        this.profileInfo = (data.homeData[1].value).splice(0, 5);
	       //  Commenting below line as we are reciecing profiles in descending order from backend.
         // this.profileInfo = (data.homeData[1].value).slice(data.homeData[1].value.length - 5, data.homeData[1].value.length).reverse();
        }
        else
          this.profileInfo = (data.homeData[1].value).splice(0, data.homeData[1].value.length);

        if (data.homeData[2].value.length > 5) {
          this.topologyInfoMsg = "(Last 5 Modified)";
          this.topologyInfo = (data.homeData[2].value).slice(data.homeData[2].value.length - 5, data.homeData[2].value.length).reverse();
        }
        else
          this.topologyInfo = (data.homeData[2].value).splice(0, data.homeData[2].value.length).reverse();

        this.agentsInfo = data.agentData;
        // data.trData.switch = data.trData.status == 'running';
        // data.trData.switch = (sessionStorage.getItem("isSwitch")) === 'true';
       
      })
  }

  getTestInfoDetails()
  {
    this.configHomeService.getTestRunStatus().subscribe(data => 
    {
      data.trData.switch = true;
      if(sessionStorage.getItem("isSwitch") === 'false')
        data.trData.switch = false;
      this.configHomeService.setTrData(data.trData);
      this.configHomeService.trData = data.trData;
      }
    );
  }
  importTopologyDialog() {
    this.loadTopologyList();
    this.selectedTopology = "";
    this.importTopo = true;
  }

  importTopology(): void {
    this.configHomeService.importTopology(this.selectedTopology).subscribe(data => {
      for(let i=0;i<data.length;i++){
        if(data[i].timestamp==null)
          data[i].timestamp="-";
      } 
      if (data.length > 5) {
        this.topologyInfoMsg = "(Last 5 Modified)";
        this.topologyInfo = (data).slice(data.length - 5, data.length).reverse();
      }
      else
        this.topologyInfo = (data).splice(0, data.length).reverse();

      this.configUtilityService.infoMessage("Topology imported successfully");
    });
    this.importTopo = false;
  }

  routeToTreemain(selectedTypeId, selectedName, type) {
    sessionStorage.setItem("agentType", "");    
    //Observable application name
    if (type == 'topology') {
      //it routes to (independent) topology screen
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main/topology', selectedTypeId]);
    }
    else {
      this.configApplicationService.applicationNameObserver(selectedName);
      this.router.navigate([this.ROUTING_PATH + '/tree-main', selectedTypeId]);
    }
  }

  routeToConfiguration(selectedProfileId, selectedProfileName, entity, selectedProfileAgent) {
    sessionStorage.setItem("agentType", selectedProfileAgent);    
    if (!('topoId' in entity) && !('tierId' in entity) && !('serverId' in entity) && !('instanceId' in entity))
      this.configProfileService.nodeData = { 'nodeType': null, 'nodeId': null };

    //Observable profile name
    this.configProfileService.profileNameObserver(selectedProfileName);
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  }
}
