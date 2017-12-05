import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo, TierInfo, ServerInfo, InstanceInfo, AutoInstrSettings, AutoIntrDTO } from '../../interfaces/topology-info';
import * as CONS from '../../constants/config-constant';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { SelectItem } from 'primeng/primeng';
import { ConfigProfileService } from '../../services/config-profile.service';
import { ProfileInfo } from '../../interfaces/profile-info';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { NodeData } from '../../containers/node-data';
import { Subscription } from 'rxjs/Subscription';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigHomeService } from '../../services/config-home.service';
import * as URL from '../../constants/config-url-constant';

@Component({
  selector: 'app-config-tree-detail',
  templateUrl: './config-tree-detail.component.html',
  styleUrls: ['./config-tree-detail.component.css']
})
export class ConfigTreeDetailComponent implements OnInit {

  //AutoInstrument Object creation
  autoInstrObj: AutoInstrSettings;
  autoInstrDto: AutoIntrDTO;

  className: string = "Tree Detail Component";

  errDialog: boolean = false;
  msg = [];
  errMsg = [];
  agentType: string = "";
  serverDisplayName: string = "";
  t_s_i_name: string = "";
  sessionName: string = "";
  autoInstrumentation: boolean = false;

  constructor(private configTopologyService: ConfigTopologyService,
    private configKeywordsService: ConfigKeywordsService,
    private route: ActivatedRoute,
    private configUtilityService: ConfigUtilityService,
    private configProfileService: ConfigProfileService,
    private router: Router,
    private configHomeService: ConfigHomeService
  ) {
    this.loadProfileList();
    this.loadTopologyData();
  }


  /* holds current topo data [either topo data /tier /server /instance data a/c to the screen] */
  topologyData: any[];

  tableHeaderInfo: any[];
  currentEntity: string = CONS.TOPOLOGY.TOPOLOGY;

  //for table header name
  selectedEntityArr: string;

  topologyEntity: TopologyInfo;
  tierEntity: TierInfo;
  serverEntity: ServerInfo;
  instanceEntity: InstanceInfo;
  selectedTopologyData: any[];

  /**For open/close edit dialog of topologies*/
  changeProf: boolean = false;
  topoData: any;

  //Dialog for auto instrumenatation configuration
  showInstr: boolean = false;

  topologyName: string;
  tierName: string;
  serverName: string;

  /**SelectItem for Profile */
  profileSelectItem: SelectItem[];

  profileData: ProfileInfo[];

  ROUTING_PATH = ROUTING_PATH;

  //used when topology is screen comes from application
  dcId: number

  //used when topology screen comes from its topology show All screen or home screen
  topoId: number

  url: string;
  subscription: Subscription;

  currentInstanceName: string;
  currentInsId: number;

  ngOnInit() {
    this.selectedEntityArr = CONS.TOPOLOGY.TOPOLOGY;
    //no need to call when store used [TO DO's]

  }

  loadTopologyData(): void {
    this.getTableHeader();
    // let url;
    this.route.params.subscribe((params: Params) => {
      this.dcId = params['dcId']
      this.topoId = params['topoId']
    });

    /**below route function is always called whenever routing changes
     * SO handling the case that required service is hit only when url contains 'tree-main' in the url.
     *
     */

    this.subscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.url = event["url"];
      let arr = this.url.split("/");
      if (arr.indexOf("tree-main") != -1) {
        if (arr.indexOf("topology") != -1) {
          this.configTopologyService.getTopologyStructureTableData(this.topoId).subscribe(data => this.topologyData = data);
        }
        else {
          this.configTopologyService.getTopologyDetail(this.dcId).subscribe(data => this.topologyData = data);
        }
      }
    })
  }

  loadProfileList() {
    this.configProfileService.getProfileList().subscribe(data => {
      this.createProfileSelectItem(data);
    });
  }

  /**For close change Profile dialog box */
  closeDialog(): void {
    this.changeProf = false;
  }



  /** For getting entity(Tier, Server, Instance) data  **/

  getData(event): void {
    this.selectedTopologyData = [];
    //this.selectedEntityArr = [CONS.TOPOLOGY.TOPOLOGY];

    //When collapsing at topology level
    if (event.data.currentEntity == CONS.TOPOLOGY.TOPOLOGY && event.data.nodeExpanded == true) {
      this.topologyName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TOPOLOGY;
      if (this.dcId != undefined)
        this.configTopologyService.getTopologyDetail(this.dcId).subscribe(data => this.topologyData = data);
      else
        this.configTopologyService.getTopologyStructureTableData(this.topoId).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel
    }

    //When expanding at topology level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TOPOLOGY && !event.data.nodeExpanded) {
      this.topologyName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIER;
      this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      sessionStorage.setItem("tierId", event.data.nodeId);
      this.configTopologyService.getTierDetail(event.data.nodeId, this.topologyEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
    }

    //When collapsing at Tier level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER && event.data.nodeExpanded == true) {
      this.tierName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIER;
      // this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      this.configTopologyService.getTierDetail(+(sessionStorage.getItem("tierId")), this.topologyEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
    }

    //When expanding at Tier level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER && !event.data.nodeExpanded) {
      //this.selectedTopologyData :TierInfo[];
      this.tierName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.SERVER;
      this.topologyData.filter(row => { if (row.tierId == event.data.nodeId) this.tierEntity = row })
      sessionStorage.setItem("serverId", event.data.nodeId);
      this.configTopologyService.getServerDetail(event.data.nodeId, this.tierEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.SERVER;
    }

    //When collapsing at Server level
    else if (event.data.currentEntity == CONS.TOPOLOGY.SERVER && event.data.nodeExpanded == true) {
      this.serverName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.SERVER;
      // this.topologyData.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      this.configTopologyService.getServerDetail(+(sessionStorage.getItem("serverId")), this.tierEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.SERVER;
    }

    //When expanding at server level
    else if (event.data.currentEntity == CONS.TOPOLOGY.SERVER && !event.data.nodeExpanded) {
      this.serverName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.INSTANCE;
      this.topologyData.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      this.configTopologyService.getInstanceDetail(event.data.nodeId, this.serverEntity).subscribe(data => {
        this.topologyData = data
        for (let i = 0; i < data.length; i++)
          if (data[i].aiEnable == true)
            this.autoInstrumentation = true
          else
            this.autoInstrumentation = false

        if (data.length != 0) {
          this.configTopologyService.getServerDisplayName(data[0].instanceId).subscribe(data => {
            this.serverDisplayName = data['_body'];

          })
        }
      });
      this.selectedEntityArr = this.topologyName + "  >  " + this.tierName + "  >  " + event.data.nodeLabel + "  :  " + CONS.TOPOLOGY.INSTANCE;
    }

    // this.selectedEntityArr = [this.selectedEntityArr.join(": ")];
    //For Table header Name
    this.getTableHeader();
  }

  /**For Display table header object */
  getTableHeader(): void {
    let tableHeaderInfo = [];

    //Default for topology detail
    let colField;
    let colHeader = ["Name", "Description", "Profile applied"];
    if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
      colHeader = ["Name", "Profile applied"];
      colField = ["topoName", "profileName"];
    }

    else if (this.currentEntity == CONS.TOPOLOGY.TIER) {
      colHeader = ["Name", "Description", "Profile applied"];
      colField = ["tierName", "tierDesc", "profileName"];
    }
    else if (this.currentEntity == CONS.TOPOLOGY.SERVER) {
      colHeader = ["Display name", "Actual name", "Profile applied"];
      colField = ["serverDisplayName", "serverName", "profileName"];
    }
    else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {

      // check whether it is application topology screen or topology details screen
      if (this.url.includes("/tree-main/topology/")) {
        colHeader = ["Display name", " Name", "Description", "Profile applied", "Enabled"];
        colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "enabled"];
      }
      else {
        colHeader = ["Display name", " Name", "Description", "Profile applied", "Enabled", "Auto-Instrumentation"];
        colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "enabled", "autoInstrumentation"];
      }
    }

    for (let i = 0; i < colField.length; i++) {
      tableHeaderInfo.push({ field: colField[i], header: colHeader[i] });
    }

    this.tableHeaderInfo = tableHeaderInfo;
  }

  editDialog(): void {
    if (!this.selectedTopologyData || this.selectedTopologyData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit profile");
      return;
    }
    else if (this.selectedTopologyData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit profile");
      return;
    }

    for (let i = 0; i < this.selectedTopologyData.length; i++) {
      if (this.selectedTopologyData[0]["instanceType"] == "Java") {
        this.configProfileService.getJavaTypeProfileList().subscribe(data => {
          this.createProfileSelectItem1(data);
        });
      }
      else if (this.selectedTopologyData[0]["instanceType"] == "Dot Net") {
        this.configProfileService.getDotNetTypeProfileList().subscribe(data => {
          this.createProfileSelectItem1(data);
        });
      }
      else if (this.selectedTopologyData[0]["instanceType"] == "NodeJS") {
        this.configProfileService.getNodeJSTypeProfileList().subscribe(data => {
          this.createProfileSelectItem1(data);
        });
      }
    }
    this.changeProf = true;
    this.topoData = Object.assign({}, this.selectedTopologyData[0]);
    // this.selectedTopologyData.empty();

  }

  saveEditProfile(): void {
    if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY)
      this.configTopologyService.updateAttachedProfTopo(this.topoData).subscribe(data => { this.updateTopo(data); this.configUtilityService.successMessage("Saved Successfully"); })
    else if (this.currentEntity == CONS.TOPOLOGY.TIER)
      this.configTopologyService.updateAttachedProfTier(this.topoData).subscribe(data => { this.updateTopo(data); this.configUtilityService.successMessage("Saved Successfully"); })
    else if (this.currentEntity == CONS.TOPOLOGY.SERVER)
      this.configTopologyService.updateAttachedProfServer(this.topoData).subscribe(data => { this.updateTopo(data); this.configUtilityService.successMessage("Saved Successfully"); })
    else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE)
      this.configTopologyService.updateAttachedProfInstance(this.topoData).subscribe(data => { this.updateTopo(data); this.configUtilityService.successMessage("Saved Successfully"); })

    // this.configUtilityService.successMessage("Saved Successfully");
  }


  //in this method we are updating current table data with new values
  updateTopo(data) {
    let that = this;
    this.topologyData.forEach(function (val) {
      if (that.currentEntity == CONS.TOPOLOGY.TOPOLOGY && val.dcTopoId == data.dcTopoId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.TIER && val.tierId == data.tierId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.SERVER && val.serverId == data.serverId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.INSTANCE && val.instanceId == data.instanceId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
    })
    this.selectedTopologyData.length = 0;
    //after submitting vales closig the dialog
    this.changeProf = false;
  }

  /**This method is used to creating topology/tier/server select item object */
  createProfileSelectItem(data) {
    this.profileSelectItem = [];
    let arr = []; //This variable is used to sort Profiles
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].profileName);
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].agent == "Java" || data[j].agent == "-") {
          if (data[j].profileName == arr[i]) {
            this.profileSelectItem.push({ label: arr[i], value: data[j].profileId });
          }
        }
      }
    }
  }

  /**This method is used to creating instance select item object */
  createProfileSelectItem1(data) {
    this.profileSelectItem = [];
    let arr = []; //This variable is used to sort Profiles
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].profileName);
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].profileName == arr[i]) {
          this.profileSelectItem.push({ label: arr[i], value: data[j].profileId });
        }
      }
    }
  }


  // routeToConfiguration(selectedProfileId, selectedProfileName) {
  //   //Observable profile name
  //   this.configProfileService.profileNameObserver(selectedProfileName);
  //   this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  // }

  routeToConfiguration(entity) {

    if ('topoId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'topology', 'nodeId': entity.topoId };
    }
    else if ('tierId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'tier', 'nodeId': entity.tierId };
    }
    else if ('serverId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'server', 'nodeId': entity.serverId };
    }
    else if ('instanceId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'instance', 'nodeId': entity.instanceId };
    }

    //Observable profile name
    this.configProfileService.profileNameObserver(entity.profileName);
    this.configProfileService.getProfileAgent(entity.profileName).subscribe(data => {
      sessionStorage.setItem("agentType", data._body);
      if (this.url.includes("/tree-main/topology/")) {
        this.router.navigate([this.ROUTING_PATH + '/tree-main/topology/profile/configuration', entity.profileId]);
      }
      else {
        this.router.navigate([this.ROUTING_PATH + '/tree-main/profile/configuration', entity.profileId]);
      }
    })

  }


  disableProfInstance(instanceId, flag) {

    this.configTopologyService.disableProfInstance(instanceId, flag).subscribe(data => {
      if (data.enabled == "true") {
        this.configUtilityService.infoMessage("Instance enabled sucessfully.");
      }
      else {
        this.configUtilityService.infoMessage("Instance disabled sucessfully.");
      }
    });
  }

  //To open auto instr configuration dialog
  openAutoInstrDialog(name, id) {
    if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null) {
      this.configUtilityService.errorMessage("Could not start instrumentation, test is not running")
      return;
    }
    this.currentInsId = id;
    this.currentInstanceName = name;
    this.autoInstrObj = new AutoInstrSettings();
    this.autoInstrDto = new AutoIntrDTO();
    this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName")
    //Getting data of settings from database if user has already saved this instance settings
    let instanceName = this.splitTierServInsName(this.currentInstanceName);
    this.autoInstrDto.sessionName = instanceName

    this.configTopologyService.getAutoInstr(this.autoInstrDto.appName, instanceName, this.sessionName).subscribe(data => {

      //Get settings from data if not null else create a new object
      if (data['_body'] != "")
        this.splitSettings(data['_body']);
      this.showInstr = true;
    })
  }

  /** To split the settings and assign to dialog
    * enableAutoInstrSession=1;minStackDepthAutoInstrSession=10;autoInstrTraceLevel=1;autoInstrSampleThreshold=120;
    * autoInstrPct=60;autoDeInstrPct=80;autoInstrMapSize=100000;autoInstrMaxAvgDuration=5;autoInstrClassWeight=10;
    * autoInstrSessionDuration=30
    */
  splitSettings(data) {
    let arr = data.split("=");
    //For enableAutoInstrSession
    if (arr[1].substring(0, arr[1].lastIndexOf(";")) == 1)
      this.autoInstrObj.enableAutoInstrSession = true;
    else
      this.autoInstrObj.enableAutoInstrSession = false;

    //For minStackDepthAutoInstrSession
    this.autoInstrObj.minStackDepthAutoInstrSession = arr[2].substring(0, arr[2].lastIndexOf(";"))

    //For autoInstrTraceLevel
    this.autoInstrObj.autoInstrTraceLevel = arr[3].substring(0, arr[3].lastIndexOf(";"))

    //For autoInstrSampleThreshold
    this.autoInstrObj.autoInstrSampleThreshold = arr[4].substring(0, arr[4].lastIndexOf(";"))

    //For autoInstrPct
    this.autoInstrObj.autoInstrPct = arr[5].substring(0, arr[5].lastIndexOf(";"))

    //For autoDeInstrPct
    this.autoInstrObj.autoDeInstrPct = arr[6].substring(0, arr[6].lastIndexOf(";"))

    //For autoInstrMapSize
    this.autoInstrObj.autoInstrMapSize = arr[7].substring(0, arr[7].lastIndexOf(";"))

    //For autoInstrMaxAvgDuration
    this.autoInstrObj.autoInstrMaxAvgDuration = arr[8].substring(0, arr[8].lastIndexOf(";"))

    //For autoInstrClassWeight
    this.autoInstrObj.autoInstrClassWeight = arr[9].substring(0, arr[9].lastIndexOf(";"))

    //For autoInstrSessionDuration
    this.autoInstrObj.autoInstrSessionDuration = arr[10];


  }


  //To apply auto instrumentation
  applyAutoInstr() {
    this.showInstr = false;

    //Setting Tier_Server_Instane in instance name
    this.autoInstrDto.instanceName = this.splitTierServInsName(this.currentInstanceName)

    //Merging all the settings in the format( K1=Val1;K2=Val2;K3=Val3... )
    this.autoInstrDto.configuration = this.createSettings(this.autoInstrObj);

    this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
    this.sessionName = this.autoInstrDto.sessionName

    this.autoInstrDto.duration = this.autoInstrObj.autoInstrSessionDuration.toString()

    //Send Runtime Changes
    this.startAutoInstrumentation(this.autoInstrObj, this.autoInstrDto)

  }

  // Create Tier_Server_Instance name
  splitTierServInsName(instanceName) {
    this.t_s_i_name = this.tierName + "_" + this.serverDisplayName + "_" + instanceName
    this.sessionName = this.t_s_i_name
    return this.t_s_i_name;
  }

  //Create auto instrumentation settings by merging them
  createSettings(data) {
    let setting;
    setting = "enableAutoInstrSession=1;minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession
      + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
      + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
      + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight
      + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration;

    return setting;

  }

  closeAutoInstrDialog() {
    this.showInstr = false;
  }

  //Reset the values of auto instrumentation settings to default
  resetToDefault() {
    this.autoInstrObj = new AutoInstrSettings();
    this.autoInstrDto = new AutoIntrDTO();
    this.autoInstrDto.sessionName = this.t_s_i_name
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  //When test is running the send RTC 
  startAutoInstrumentation(data, autoInstrDto) {
    let that = this
    console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
    console.log(this.className, "constructor", "this.configProfileService.nodeData", this.configProfileService.nodeData);

    //if test is offline mode, return (no run time changes)
    if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null) {
      console.log(this.className, "constructor", "No NO RUN TIme Changes");
      return;
    }
    else {
      //Getting keywords data whose values are different from default values
      let strSetting = this.getSettingForRTC(data);
      console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData", this.configProfileService.nodeData);
      const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;

      //Merging configuration and instance name with #
      strSetting = strSetting + "#" + this.t_s_i_name;

      //Saving settings in database
      let success = this.configTopologyService.sendRTCAutoInstr(url, strSetting, autoInstrDto, function (success) {
        //Check for successful RTC connection
        if (success == "success") {
          that.configTopologyService.updateAIEnable(that.currentInsId, true).subscribe(data => {
            that.autoInstrumentation = true;
          })
        }
      })
    }
  }

  //To stop auto-insrumentation
  stopInstrumentation(instanceName, id) {
    let that = this;
    console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
    let strSetting = "";
    this.currentInsId = id
    //if test is offline mode, return (no run time changes)
    if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null) {
      console.log(this.className, "constructor", "No NO RUN TIme Changes");
      return;
    }
    else {
      //Getting keywords data whose values are different from default values
      console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData");
      const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;
      strSetting = "enableAutoInstrSession=0;"
      this.t_s_i_name = this.splitTierServInsName(instanceName)
      //Merging configuration and instance name with #
      strSetting = strSetting + "#" + this.t_s_i_name;

      //Saving settings in database
      let success = this.configTopologyService.sendRTCTostopAutoInstr(url, strSetting, that.t_s_i_name, that.sessionName, function (data) {

        //Check for successful RTC connection  
        if (data.length != 0 || !data[0]['contains'])
        that.configTopologyService.updateAIEnable(that.currentInsId, false).subscribe(data => {
          that.autoInstrumentation = false;
        })
      })


    }

  }

  //Getting the settings value which are different from default values
  getSettingForRTC(data) {
    let strSetting = "";
    //Storing enableAutoInstrSession keyword value as it will always be different from default value i.e., 0
    strSetting = "enableAutoInstrSession=1%20" + this.sessionName;

    //Comparing all the setting's value with their default value, if they dont match then append in strSetting variable
    if (data.minStackDepthAutoInstrSession != 10)
      strSetting = strSetting + ";minStackDepthAutoInstrSession=" + data.minStackDepthAutoInstrSession

    if (data.autoInstrTraceLevel != 1)
      strSetting = strSetting + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel

    if (data.autoInstrSampleThreshold != 120)
      strSetting = strSetting + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold

    if (data.autoInstrPct != 60)
      strSetting = strSetting + ";autoInstrPct=" + data.autoInstrPct

    if (data.autoDeInstrPct != 80)
      strSetting = strSetting + ";autoDeInstrPct=" + data.autoDeInstrPct

    if (data.autoInstrMapSize != 100000)
      strSetting = strSetting + ";autoInstrMapSize=" + data.autoInstrMapSize

    if (data.autoInstrMaxAvgDuration != 5)
      strSetting = strSetting + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration

    if (data.autoInstrClassWeight != 10)
      strSetting = strSetting + ";autoInstrClassWeight=" + data.autoInstrClassWeight

    if (data.autoInstrSessionDuration != 30)
      strSetting = strSetting + ";autoInstrSessionDuration=" + data.autoInstrSessionDuration

    return strSetting;

  }


}
