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


@Component({
  selector: 'app-config-tree-detail',
  templateUrl: './config-tree-detail.component.html',
  styleUrls: ['./config-tree-detail.component.css']
})
export class ConfigTreeDetailComponent implements OnInit {

  //AutoInstrument Object creation
  autoInstrObj: AutoInstrSettings;
  autoInstrDto: AutoIntrDTO;

  constructor(private configTopologyService: ConfigTopologyService,

    private route: ActivatedRoute,
    private configUtilityService: ConfigUtilityService,
    private configProfileService: ConfigProfileService,
    private router: Router,

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

    //When expandong at server level
    else if (event.data.currentEntity == CONS.TOPOLOGY.SERVER && !event.data.nodeExpanded) {
      this.serverName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.INSTANCE;
      this.topologyData.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      this.configTopologyService.getInstanceDetail(event.data.nodeId, this.serverEntity).subscribe(data =>{
        this.topologyData = data});
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
      colHeader = ["Display name", " Name", "Description", "Profile applied", "Enabled", "Auto-Instrumentation"];
      colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "enabled", "autoInstrumentation"];
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



  /**This method is used to creating topology select item object */
  createProfileSelectItem(data) {
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
    if (this.url.includes("/tree-main/topology/")) {
      this.router.navigate([this.ROUTING_PATH + '/tree-main/topology/profile/configuration', entity.profileId]);
    }
    else {
      this.router.navigate([this.ROUTING_PATH + '/tree-main/profile/configuration', entity.profileId]);
    }
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
  openAutoInstrDialog(name) {
    this.currentInstanceName = name;
    this.autoInstrObj = new AutoInstrSettings();
    this.autoInstrDto = new AutoIntrDTO();
    this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName")
    //Getting data of settings from database if user has already saved this instance settings
    let instanceName = this.splitTierServInsName(this.selectedEntityArr, this.currentInstanceName);
    this.configTopologyService.getAutoInstr(this.autoInstrDto.appName, instanceName).subscribe(data => {

      //Get settings from data if not null else create a new object
      if(data['_body'] != "")
        this.splitSettings(data['_body']);
      this.showInstr = true;
    })
  }

  /** To split the settings and assign to dialog
    * enableDebugSession=1;minStackDepthDebugSession=10;autoInstrTraceLevel=1;autoInstrSampleThreshold=120;
    * autoInstrPct=60;autoDeInstrPct=80;autoInstrMapSize=100000;autoInstrMaxAvgDuration=5;autoInstrClassWeight=10
    */
  splitSettings(data) {
    let arr = data.split("=");
    //For enableDebugSession
    if (arr[1].substring(0, arr[1].lastIndexOf(";")) == 1)
      this.autoInstrObj.enableDebugSession = true;
    else
      this.autoInstrObj.enableDebugSession = false;

    //For minStackDepthDebugSession
    this.autoInstrObj.minStackDepthDebugSession = arr[2].substring(0, arr[2].lastIndexOf(";"))

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
    this.autoInstrObj.autoInstrClassWeight = arr[9];

  }


  //To aapply auto instrumentation
  applyAutoInstr() {
    this.showInstr = false;

    //Setting Tier_Server_Instane in instance name
    this.autoInstrDto.instanceName = this.splitTierServInsName(this.selectedEntityArr, this.currentInstanceName)

    //Merging all the settings in the format( K1=Val1;K2=Val2;K3=Val3... )
    this.autoInstrDto.configuration = this.createSettings(this.autoInstrObj);

    this.autoInstrDto.appName = sessionStorage.getItem("selectedApplicationName");
    this.autoInstrDto.duration = this.autoInstrObj.autoInstrMaxAvgDuration

    //Saving settings in database
    this.configTopologyService.applyAutoInstr(this.autoInstrDto).subscribe(data => {
      this.autoInstrDto = data;
      this.configUtilityService.successMessage("Saved successfully")
    })
  }

  // Create Tier_Server_Instance name from the format (mutiTierTopology  >  ATG-APP14  >  10.10.40.6  :  Instance )
  splitTierServInsName(name, instanceName) {
    let arr = name.split("  >  ")
    let t_s_i_name = arr[1] + "_" + arr[2].substring(0, (arr[2].lastIndexOf(":") - 2)) + "_" + instanceName;

    return t_s_i_name;
  }

  //Create auto instrumentation settings by merging them
  createSettings(data) {
    let setting;
    if (data.enableDebugSession == true)
      setting = "enableDebugSession=1" + ";minStackDepthDebugSession=" + data.minStackDepthDebugSession
        + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
        + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
        + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight;

    else
      setting = "enableDebugSession=0" + ";minStackDepthDebugSession=" + data.minStackDepthDebugSession
        + ";autoInstrTraceLevel=" + data.autoInstrTraceLevel + ";autoInstrSampleThreshold=" + data.autoInstrSampleThreshold
        + ";autoInstrPct=" + data.autoInstrPct + ";autoDeInstrPct=" + data.autoDeInstrPct + ";autoInstrMapSize=" + data.autoInstrMapSize
        + ";autoInstrMaxAvgDuration=" + data.autoInstrMaxAvgDuration + ";autoInstrClassWeight=" + data.autoInstrClassWeight;
    return setting;

  }

  closeAutoInstrDialog() {
    this.showInstr = false;
  }

  //Reset the values of auto instrumentation settings to default
  resetToDefault(){ 
    this.autoInstrObj = new AutoInstrSettings();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }
}
