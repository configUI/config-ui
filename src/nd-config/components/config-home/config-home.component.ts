import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationInfo } from '../../interfaces/application-info';
import { ConfigHomeService } from '../../services/config-home.service';
import { ConfigProfileService } from '../../services/config-profile.service'
import { ConfigApplicationService } from '../../services/config-application.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigKeywordsService } from './../../services/config-keywords.service';

import { MainInfo } from '../../interfaces/main-info';
import { EntityInfo } from '../../interfaces/entity-info';
import { NDAgentInfo } from '../../interfaces/nd-agent-info';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ConfigUiUtility } from '../../utils/config-utility';
import { Http} from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { ImmutableArray } from '../../utils/immutable-array';

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
  topoPermission:boolean;
  appPerm: boolean;
  profilePerm: boolean;
  noProfilePerm: boolean;
  noAppPerm: boolean;
  noTopoPerm:boolean;
  isHomePermDialog: boolean;

    //Applied profile list
    appliedProfileList = [];

    //To store running application
    runningApp: string = "";
  
  refreshIntervalTime = 30000;
  subscription: Subscription;
  
  constructor(private configKeywordsService: ConfigKeywordsService,private http: Http,private configHomeService: ConfigHomeService, private configUtilityService: ConfigUtilityService, private configProfileService: ConfigProfileService, private configApplicationService: ConfigApplicationService, private router: Router) { }

  ngOnInit() {
        /** Get list of applied profile in the application */
        this.configProfileService.getListOfAppliedProfile((data) => {
          this.appliedProfileList = data
    //this.configHomeService.getAIStartStopOperationOnHome();
// this.configHomeService.getAIStartStopOperationOnHome();
var userName = sessionStorage.getItem('sesLoginName');
var passWord =  sessionStorage.getItem('sesLoginPass');
// let URL=sessionStorage.getItem('host');
// var url =  URL + 'DashboardServer/acl/user/authenticateNDConfigUI?userName=' + userName;
// this.http.get(url).map(res => res.json()).subscribe(data => {
  sessionStorage.setItem("ProfileAccess","6");
  sessionStorage.setItem("ApplicationAccess","6");
  sessionStorage.setItem("TopologyAccess","6");
  sessionStorage.setItem("InstrProfAccess","6");
  sessionStorage.setItem("AutoDiscoverAccess","6");
  this.appPerm=+sessionStorage.getItem("ApplicationAccess") == 4 ? true: false;
  this.profilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true: false;
  this.topoPermission=+sessionStorage.getItem("TopologyAccess") == 4 ? true: false;
  this.noProfilePerm=+sessionStorage.getItem("ProfileAccess") == 0 ? true: false;
  this.noAppPerm=+sessionStorage.getItem("ApplicationAccess") == 0 ? true: false;
  this.noTopoPerm=+sessionStorage.getItem("TopologyAccess") == 0 ? true: false;
  if(this.noProfilePerm && this.noAppPerm && this.noTopoPerm)
    this.isHomePermDialog=true;
  this.loadHomeData();
       ///  });
        });

        //If test is running then get the running application name
        let trNo = sessionStorage.getItem("isTrNumber");
        if(trNo != "null")
          this.loadRunningApp(trNo);
  }

  //To get the running application name when test is running
  loadRunningApp(trNo): any {
    this.configHomeService.getRunningApp(trNo).subscribe(data => {
      this.runningApp = data["_body"];
    })
  }

  // loadTopologyList(){
  // }
  
  /**Getting topology list , application list and profile list. */
  loadHomeData(): void {
    // this.loadTopologyList();
    this.configHomeService.getTopologyList().subscribe(data => {
      data = data.sort();
      this.topologyList = ConfigUiUtility.createListWithKeyValue(data, data);
      this.configApplicationService.addTopoDetails(data).subscribe(data => {
        this.configHomeService.getMainData()
        .subscribe(data => {
          if (data.homeData[0].value.length > 5) {
            this.applicationMsg = "(Last 5 Modified)";
            this.applicationInfo = (data.homeData[0].value).slice(data.homeData[0].value.length - 5, data.homeData[0].value.length).reverse();
          }
          else
          this.applicationInfo = (data.homeData[0].value).splice(0, data.homeData[0].value.length).reverse();
          
          // This is done to remove default profiles if we are having the other profiles to show in home screen
          let tempArray = [];
        for (let i = 0; i < data.homeData[1].value.length; i++) {
          if (+data.homeData[1].value[i]["id"] == 1 || +data.homeData[1].value[i]["id"] == 777777 || +data.homeData[1].value[i]["id"] == 888888) {
            tempArray.push(data.homeData[1].value[i]);
          }
        }

        data.homeData[1].value.splice(0,3);
        for(let j=0;j<tempArray.length;j++){
          data.homeData[1].value=ImmutableArray.push(data.homeData[1].value, tempArray[j]);
        }
        if (data.homeData[1].value.length >= 5) {
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
      })
    })
  })
    }
    
  //   importTopologyDialog() {
  //   this.loadTopologyList();
  //   this.selectedTopology = "";
  //   this.importTopo = true;
  // }

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
    sessionStorage.setItem("showserverinstance", "false");
    sessionStorage.setItem("isAppliedProfile", "false");
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

  routeToConfiguration(selectedProfileId, selectedProfileName, entity,selectedProfileAgent) {
  sessionStorage.setItem("agentType", selectedProfileAgent);

      //Check if the selected profile is applied at running application or not if yes then set in session
      if(this.appliedProfileList.includes(selectedProfileName)){
        sessionStorage.setItem("isAppliedProfile", "true");
      }
      else{
        sessionStorage.setItem("isAppliedProfile", "false");
      }
    if (!('topoId' in entity) && !('tierId' in entity) && !('serverId' in entity) && !('instanceId' in entity))
      this.configProfileService.nodeData = { 'nodeType': null, 'nodeId': null, 'nodeName' : null, 'topologyName' : null };

    //Observable profile name
    this.configProfileService.profileNameObserver(selectedProfileName);
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  }
  redirectToPage(){
    if(+sessionStorage.getItem("AutoDiscoverAccess") != 0)
      this.router.navigate(['/home/config/auto-discover']);
    else
      this.router.navigate(['/home/config/instrumentation-profile-maker']);
    this.isHomePermDialog=false;
  }
 
  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog 
   * related to the current component.
   */
  sendHelpNotification(value:string) {
    if(value == "Application"){
      this.configKeywordsService.getHelpContent("Home","Application" ,"");
    }
    if(value == "Profile"){
      this.configKeywordsService.getHelpContent("Home","Profile","");
    }
    if(value == "Topology"){
      this.configKeywordsService.getHelpContent("Home","Topology","");
    }
}
}
