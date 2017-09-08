import { Component, OnInit } from '@angular/core';
import { AutoDiscoverData } from "../../../containers/auto-discover-data";
import { NDAgentInfo } from '../../../interfaces/nd-agent-info';
import { ConfigNdAgentService } from '../../../services/config-nd-agent.service';
import { ConfigUiUtility } from '../../../utils/config-utility';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { ROUTING_PATH } from '../../../constants/config-url-constant';
import { Router } from '@angular/router';


@Component({
  selector: 'app-config-auto-discover-main',
  templateUrl: './config-auto-discover-main.component.html',
  styleUrls: ['./config-auto-discover-main.component.css']
})
export class ConfigAutoDiscoverMainComponent implements OnInit {

  constructor(private configNdAgentService: ConfigNdAgentService, private configUtilityService: ConfigUtilityService, private router: Router) { }

  /**Getting application list data */
  ndAgentStatusData: NDAgentInfo[];

  //Auto discover data details
  autoDiscoverDetail: AutoDiscoverData;

  //Agent's dropdown label and value
  agentLabel: any[] = [];
  agentValue: any[] = [];

  agents: any[] = [];

  instanceList: any[] = [];

  adrFile: any;

  ROUTING_PATH = ROUTING_PATH;

  ngOnInit() {
    this.autoDiscoverDetail = new AutoDiscoverData();
    this.loadNDAgentStatusData();
    this.loadAdrFiles();    
    this.autoDiscoverDetail.discoveryMode = 1;
  }

  /**Getting application list data */
  loadNDAgentStatusData(): void {
    this.configNdAgentService.getNDAgentStatusData().subscribe(data => {
      this.ndAgentStatusData = data;
       this.getConnectedAgentsList(data); 
    });

  }

  /**Get list of agents from ND agent info */
  getConnectedAgentsList(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].at == "Java" && data[i].st == "Active") {

        this.agentLabel.push(data[i].tier + "_" + data[i].server + "_" + data[i].instance);
        this.agentValue.push(data[i].tier + "_" + data[i].server + "_" + data[i].instance);
      }
     this.agents = ConfigUiUtility.createListWithKeyValue(this.agentLabel, this.agentValue);

    }
  }

  /** Load list of instances  */
  loadAdrFiles() {
    this.configNdAgentService.getInstanceList().subscribe(data => {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let temp = data[i].split(".adr")
        arr[i] = temp[0];
      }
      this.instanceList = ConfigUiUtility.createListWithKeyValue(arr, arr);
    })
  }


  discoverData() {
    if (this.autoDiscoverDetail.discoveryMode == 1) {
      if ((this.autoDiscoverDetail.classFilters == null && this.autoDiscoverDetail.methodFilters == null) || (this.autoDiscoverDetail.methodFilters == "" && this.autoDiscoverDetail.classFilters == "")) {
        this.configUtilityService.errorMessage("Provide atleast one of the filters");
        return;
      }
    }
    else if (this.autoDiscoverDetail.discoveryMode == 0) {
      this.autoDiscoverDetail.classFilters = "";
      this.autoDiscoverDetail.methodFilters = "";
    }
    else {
      this.configUtilityService.errorMessage("Choose a discovery mode");
      return;
    }

    this.configNdAgentService.discoverData(this.autoDiscoverDetail).subscribe(data => {
      this.autoDiscoverDetail = data;
      this.loadAdrFiles();
     
      if(data.status == 'empty' && data.discoveryMode == '1')
        this.configUtilityService.errorMessage("Discovered class name or method name is wrong.");
      else if(data.status == 'empty' && data.discoveryMode == '0')
        this.configUtilityService.errorMessage("Auto discover method file is empty");
      else
        this.configUtilityService.successMessage("Data discovered successfully");   
 
   })

  }

  resetAllFields(){
    this.autoDiscoverDetail.classFilters = "";
    this.autoDiscoverDetail.methodFilters = "";
    this.autoDiscoverDetail.discoveryMode = 1;
    this.autoDiscoverDetail.agents = "";
  }

  openAdrFile() {
    sessionStorage.setItem("adrFile", this.adrFile + ".adr");
    this.router.navigate([this.ROUTING_PATH + '/auto-discover-tree']);
  }
}