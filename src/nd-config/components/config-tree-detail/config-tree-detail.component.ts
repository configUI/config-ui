import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo, TierGroupInfo, TierInfo, ServerInfo, InstanceInfo, AutoInstrSettings, AutoIntrDTO } from '../../interfaces/topology-info';
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

  className: string = "Tree Detail Component";

  errDialog: boolean = false;
  msg = [];
  errMsg = [];
  agentType: string = "";
  serverDisplayName: string = "";

  perm: boolean;
  noProfilePerm: boolean;
  isAIPerm: boolean;
  t_s_i_name: string;

  passAIDDSettings: any[];
  passAIDDserverEntity: ServerInfo;
  routingFromAIGui: boolean;
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
  topologyDataAIInstanceLevel: any[];
  showserverinstance: string;

  tableHeaderInfo: any[];
  currentEntity: string = CONS.TOPOLOGY.TOPOLOGY;

  //for table header name
  selectedEntityArr: string;

  topologyEntity: TopologyInfo;
  tierGroupEntity: TierGroupInfo;
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
  tierGroupName: string;
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
  currentInsType: string;

  serverId: any;

  ngOnInit() {

    this.showserverinstance = sessionStorage.getItem("showserverinstance");

    if (this.showserverinstance == "false")
      this.routingFromAIGui = true;

    this.topologyData = [];

    if (+sessionStorage.getItem("ApplicationAccess") == 4 || +sessionStorage.getItem("TopologyAccess") == 4)
      this.perm = true;
    else
      this.perm = false;
    this.noProfilePerm = +sessionStorage.getItem("ProfileAccess") == 0 ? true : false;
    if (+sessionStorage.getItem("ApplicationAccess") == 4 || +sessionStorage.getItem("AutoDiscoverAccess") == 4 || +sessionStorage.getItem("AutoDiscoverAccess") == 0) {
      this.isAIPerm = true;
    }
    else
      this.isAIPerm = false;
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
          this.configTopologyService.getTopologyStructureTableData(this.topoId).subscribe(data => {
            if (this.showserverinstance == "false")
              this.topologyData = data;
            else
              this.topologyDataAIInstanceLevel = data
          });
        }
        else {
          this.configTopologyService.getTopologyDetail(this.dcId).subscribe(data => {
            //only show Instance level data in topology detail gui if showserverinstance is true
            if (this.showserverinstance == "false")
              this.topologyData = data;
            else {
              this.topologyDataAIInstanceLevel = data
            }
          });
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

  /** For getting entity(TierGroup, Tier, Server, Instance) data  **/

  getData(event): void {
    if (sessionStorage.getItem("showserverinstance") == "false")
      this.showserverinstance = "false";

    this.selectedTopologyData = [];

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

      this.currentEntity = CONS.TOPOLOGY.TIERGROUP;

      //only show Instance level data in topology detail gui if showserverinstance is true
      if (this.showserverinstance == "false")
        this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      else
        this.topologyDataAIInstanceLevel.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })

      sessionStorage.setItem("topoId", event.data.nodeId);
      this.configTopologyService.getTierGroupDetail(event.data.nodeId, this.topologyEntity).subscribe(data => {
        if (this.showserverinstance == "false") {
          this.routingFromAIGui = true;
          this.topologyData = data;
          this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIERGROUP;
        }
        else {
          this.routingFromAIGui = false;
          this.topologyDataAIInstanceLevel = data;
          if (this.topologyDataAIInstanceLevel.length == 0) {
            this.routingFromAIGui = true;
            this.configUtilityService.successMessage("Current Topology doesn't contains any TierGroups, Select other Topology.");
            sessionStorage.setItem("showserverinstance", "false");
            this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIERGROUP;
          }
        }
      });
    }

    //When collapsing at TierGroup level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIERGROUP && event.data.nodeExpanded == true) {
      this.tierName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIERGROUP;
      // this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      this.configTopologyService.getTierGroupDetail(+(sessionStorage.getItem("topoId")), this.topologyEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIERGROUP;
    }

    //When expanding at TierGroup level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIERGROUP && !event.data.nodeExpanded) {
      this.tierGroupName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIER;
      /*only show Instance level data in topology detail gui if showserverinstance is true */

      if (this.showserverinstance == "false") {
        this.topologyData.filter(row => { if (row.tierGroupName == event.data.nodeLabel) this.tierGroupEntity = row })
      }
      else {
        this.topologyDataAIInstanceLevel.filter(row => { if (row.tierGroupName == event.data.nodeLabel) this.tierGroupEntity = row })
      }
      sessionStorage.setItem("tierGroupName", event.data.nodeLabel);
      this.configTopologyService.getTierDetail(event.data.nodeLabel, this.tierGroupEntity).subscribe(data => {
        if (this.showserverinstance == "false") {
          this.routingFromAIGui = true;
          this.topologyData = data;
          this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
        }
        else {
          this.routingFromAIGui = false;
          this.topologyDataAIInstanceLevel = data;
          if (this.topologyDataAIInstanceLevel.length == 0) {
            this.routingFromAIGui = true;
            this.configUtilityService.successMessage("Current Topology doesn't contains any Tier Groups.");
            sessionStorage.setItem("showserverinstance", "false");
            this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
          }
        }
      });
    }

    //When collapsing at Tier level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER && event.data.nodeExpanded == true) {
      this.tierName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.TIER;
      // this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      this.configTopologyService.getTierDetail((sessionStorage.getItem("tierGroupName")), this.tierGroupEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr = event.data.nodeLabel + " : " + CONS.TOPOLOGY.TIER;
    }

    //When expanding at Tier level
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER && !event.data.nodeExpanded) {
      //this.selectedTopologyData :TierInfo[];
      this.tierName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.SERVER;
      //only show Instance level data in topology detail gui if showserverinstance is true
      if (this.showserverinstance == "false") {
        this.topologyData.filter(row => { if (row.tierId == event.data.nodeId) this.tierEntity = row })
      }
      else {
        this.topologyDataAIInstanceLevel.filter(row => { if (row.tierId == event.data.nodeId) this.tierEntity = row })
      }
      sessionStorage.setItem("serverId", event.data.nodeId);
      this.configTopologyService.getServerDetail(event.data.nodeId, this.tierEntity).subscribe(data => {
        if (this.showserverinstance == "false") {
          this.routingFromAIGui = true;
          this.topologyData = data;
          this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.SERVER;
        }
        else {
          this.routingFromAIGui = false;
          this.topologyDataAIInstanceLevel = data;
          if (this.topologyDataAIInstanceLevel.length == 0) {
            this.routingFromAIGui = true;
            this.configUtilityService.successMessage("Current Tier doesn't contains any Server, Select other Tier or Topology.");
            sessionStorage.setItem("showserverinstance", "false");
            this.selectedEntityArr = this.topologyName + "  >  " + event.data.nodeLabel + " : " + CONS.TOPOLOGY.SERVER;
          }
        }
      });
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
      let that = this;
      this.serverName = event.data.nodeLabel;
      this.currentEntity = CONS.TOPOLOGY.INSTANCE;
      //only show Instance level data in topology detail gui if showserverinstance is true

      if (this.showserverinstance == "false")
        this.topologyData.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      else
        this.topologyDataAIInstanceLevel.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      this.serverId = event.data.nodeId;


      //Update the status of AI and icon when AI process id completed when its duration is completed
      this.configTopologyService.durationCompletion().subscribe(data => {
        that.configTopologyService.getInstanceDetail(event.data.nodeId, that.serverEntity).subscribe(data => {
          that.topologyData = data;
          this.routingFromAIGui = true;
          if ((that.topologyData.length == 0) && (this.showserverinstance == "true")) {
            sessionStorage.setItem("showserverinstance", "false");
            this.configUtilityService.successMessage("Current Server doesn't contains any Instance, Select other Server, Tier or Topology.");
          }
          if (data.length != 0) {
            that.configTopologyService.getServerDisplayName(data[0].instanceId).subscribe(data2 => {
              that.serverDisplayName = data2['_body'];
            })
          }
        });
      })
      this.selectedEntityArr = this.topologyName + "  >  " + this.tierName + "  >  " + event.data.nodeLabel + "  :  " + CONS.TOPOLOGY.INSTANCE;
    }

    // this.selectedEntityArr = [this.selectedEntityArr.join(": ")];
    //For Table header Name
    if (this.showserverinstance == "true") {
      setTimeout(() => { this.getTableHeader() }, 250)
    }
    else
      this.getTableHeader();
  }

  /**For Display table header object */
  getTableHeader(): void {
    let tableHeaderInfo = [];

    //Default for topology detail
    let colField = [];
    let colHeader = ["Name", "Description", "Profile applied"];
    if (this.showserverinstance == "false" || sessionStorage.getItem("showserverinstance") == "false") {

      if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
        colHeader = ["Name", "Profile applied"];
        colField = ["topoName", "profileName"];
      }
      else if (this.currentEntity == CONS.TOPOLOGY.TIERGROUP) {
        colHeader = ["Name", " Tier Group Defination", "Profile applied"];
        colField = ["tierGroupName", "tierGroupDefination", "profileName"];
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
          colHeader = ["Display name", " Name", "Description", "Profile applied"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName"];
        }
        else {
          colHeader = ["Display name", " Name", "Description", "Profile applied", "Auto-Instrumentation"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "aiEnable"];
        }
      }
    }
    else {
      if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {
        // check whether it is application topology screen or topology details screen
        if (this.url.includes("/tree-main/topology/")) {
          colHeader = ["Display name", " Name", "Description", "Profile applied"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName"];
        }
        else {
          colHeader = ["Display name", " Name", "Description", "Profile applied", "Auto-Instrumentation"];
          colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "aiEnable"];
        }
      }
    }


    //Hiding toggle at instance level
    // else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {

    //   // check whether it is application topology screen or topology details screen
    //   if (this.url.includes("/tree-main/topology/")) {
    //     colHeader = ["Display name", " Name", "Description", "Profile applied", "Enabled"];
    //     colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "enabled"];
    //   }
    //   else {
    //     colHeader = ["Display name", " Name", "Description", "Profile applied", "Enabled", "Auto-Instrumentation"];
    //     colField = ["instanceDisplayName", "instanceName", "instanceDesc", "profileName", "enabled", "aiEnable"];
    //   }
    // }
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

    //    for (let i = 0; i < this.selectedTopologyData.length; i++) {
    //      if (this.selectedTopologyData[0]["instanceType"] == "Java") {
    //        this.configProfileService.getJavaTypeProfileList().subscribe(data => {
    //          this.createProfileSelectItem1(data);
    //        });
    //      }
    //      else if (this.selectedTopologyData[0]["instanceType"] == "Dot Net") {
    //        this.configProfileService.getDotNetTypeProfileList().subscribe(data => {
    //          this.createProfileSelectItem1(data);
    //        });
    //      }
    //      else if (this.selectedTopologyData[0]["instanceType"] == "NodeJS") {
    //        this.configProfileService.getNodeJSTypeProfileList().subscribe(data => {
    //          this.createProfileSelectItem1(data);
    //        });
    //      }
    //    }
    this.changeProf = true;
    this.topoData = Object.assign({}, this.selectedTopologyData[0]);
    // this.selectedTopologyData.empty();

  }

  saveEditProfile(): void {
    if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY)
      this.configTopologyService.updateAttachedProfTopo(this.topoData).subscribe(data => {
        this.updateTopo(data); this.configUtilityService.successMessage("Saved Successfully");
      })
    else if (this.currentEntity == CONS.TOPOLOGY.TIERGROUP)
      this.configTopologyService.updateAttachedProfTierGroup(this.topoData).subscribe(data => { this.updateTopo(data); this.configUtilityService.successMessage("Saved Successfully"); })
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
      else if (that.currentEntity == CONS.TOPOLOGY.TOPOLOGY && val.topoId == data.topoId) {
        val.profileId = data.profileId
        val.profileName = data.profileName
      }
      else if (that.currentEntity == CONS.TOPOLOGY.TIERGROUP && val.tierGroupName == data.tierGroupName) {
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
    //after submitting vales closing the dialog
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
        //      if (data[j].agent == "Java" || data[j].agent == "-") {
        if (data[j].profileName == arr[i]) {
          this.profileSelectItem.push({ label: arr[i], value: data[j].profileId });
        }
        //      }
      }
    }
  }

  /**This method is used to creating instance select item object */
  //  createProfileSelectItem1(data) {
  //    this.profileSelectItem = [];
  //    let arr = []; //This variable is used to sort Profiles
  //    for (let i = 0; i < data.length; i++) {
  //      arr.push(data[i].profileName);
  //    }
  //    arr.sort();
  //    for (let i = 0; i < arr.length; i++) {
  //      for (let j = 0; j < data.length; j++) {
  //        if (data[j].profileName == arr[i]) {
  //          this.profileSelectItem.push({ label: arr[i], value: data[j].profileId });
  //        }
  //      }
  //    }
  //  }


  // routeToConfiguration(selectedProfileId, selectedProfileName) {
  //   //Observable profile name
  //   this.configProfileService.profileNameObserver(selectedProfileName);
  //   this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  // }

  routeToConfiguration(entity) {

    if ('topoId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'topology', 'nodeId': entity.topoId };
    }
    else if ('tierGroupId' in entity) {
      this.configProfileService.nodeData = { 'nodeType': 'tierGroup', 'nodeId': entity.tierGroupId };
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


  disableProfInstance(instanceId, flag, profileID) {
    this.configTopologyService.disableProfInstance(instanceId, flag, profileID).subscribe(data => {
      if (data.enabled == "true") {
        this.configUtilityService.infoMessage("Instance enabled sucessfully.");
      }
      else {
        this.configUtilityService.infoMessage("Instance disabled sucessfully.");
      }
    });
  }

  //To open auto instr configuration dialog
  openAutoInstrDialog(name, id, type, profileId, profileName) {

    if (this.configHomeService.trData.status == null) {
      this.configUtilityService.errorMessage("Could not start instrumentation, Session is not running")
      return;
    }
    if (sessionStorage.getItem("isSwitch") === 'false') {
      this.configUtilityService.errorMessage("Please enable Session toggle button for AI");
      return;
    }
    if (type == "Java" || type == "DotNet" || type == "java") {
      this.passAIDDserverEntity = this.serverEntity;
      this.passAIDDSettings = [name, id, type, this.tierName, this.serverName, this.serverId, profileId, "btName", "ND ConfigUI", "running", sessionStorage.getItem("isTrNumber")];
      this.showInstr = true;
    }
    else {
      this.configUtilityService.errorMessage("Could not start AI, supported only for Java and Dot Net")
      return;
    }
  }

  closeAIDDDialog(isCloseAIDDDialog) {
    this.showInstr = isCloseAIDDDialog;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setTopologyData(data) {
    this.showInstr = false;
    this.topologyData = data;
  }

  //To stop auto-insrumentation
  stopInstrumentation(instanceName, id) {
    let desc: any = "";
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
      //Getting the type of AI process running(AI/DD)
      this.configTopologyService.getInstanceDesc(id).subscribe(data => {
        desc = data['_body'].toString();
        //If radio button for AI is selected
        if (desc.endsWith("#AI"))
          strSetting = "enableAutoInstrSession=0;"

        //If radio button for DD is selected
        else {
          strSetting = "enableDDAI=0;";
        }
        this.t_s_i_name = this.splitTierServInsName(instanceName)
        let name = this.createTierServInsName(instanceName)
        //Merging configuration and instance name with #
        strSetting = strSetting + "#" + this.createTierServInsName(instanceName);

        //Saving settings in database
        let success = this.configTopologyService.sendRTCTostopAutoInstr(url, strSetting, name, this.t_s_i_name, function (data) {

          //Check for successful RTC connection  
          if (data.length != 0 || !data[0]['contains']) {
            that.configTopologyService.updateAIEnable(that.currentInsId, false, "stop", that.topologyName).subscribe(data => {
              that.configTopologyService.getInstanceDetail(that.serverId, that.serverEntity).subscribe(data => {

                that.topologyData = data;
              });
              that.configHomeService.getAIStartStopOperationValue(false);
            })
          }
        })
      })
    }
  }

  // Create Tier_Server_Instance name
  splitTierServInsName(instanceName) {
    this.t_s_i_name = this.tierName + "_" + this.serverName + "_" + instanceName
    // this.sessionName = this.t_s_i_name
    return this.t_s_i_name;
  }

  // Create Tier>Server>Instance name
  createTierServInsName(instanceName) {
    let name = this.tierName + ">" + this.serverName + ">" + instanceName
    return name;
  }
  accessMessage() {
    this.configUtilityService.errorMessage("Permission Denied!!!")
  }

}
