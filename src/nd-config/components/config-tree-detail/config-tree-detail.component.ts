

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigTopologyService } from '../../services/config-topology.service';
import { TopologyInfo, TierInfo, ServerInfo, InstanceInfo } from '../../interfaces/topology-info';
import * as CONS from '../../constants/config-constant';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { SelectItem } from 'primeng/primeng';
import { ConfigProfileService } from '../../services/config-profile.service';
import { ProfileInfo } from '../../interfaces/profile-info';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { NodeData } from '../../containers/node-data';


@Component({
  selector: 'app-config-tree-detail',
  templateUrl: './config-tree-detail.component.html',
  styleUrls: ['./config-tree-detail.component.css']
})
export class ConfigTreeDetailComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService,

    private route: ActivatedRoute,
    private configUtilityService: ConfigUtilityService,
    private configProfileService: ConfigProfileService,
    private router: Router
  ) { }


  /* holds current topo data [either topo data /tier /server /instance data a/c to the screen] */
  topologyData: any[];

  tableHeaderInfo: any[];
  currentEntity: string = CONS.TOPOLOGY.TOPOLOGY;
  selectedEntityArr: string[];
  topologyEntity: TopologyInfo;
  tierEntity: TierInfo;
  serverEntity: ServerInfo;
  instanceEntity: InstanceInfo;
  selectedTopologyData: any[];

  /**For open/close edit dialog of topologies*/
  changeProf: boolean = false;
  topoData: any;

  /**SelectItem for Profile */
  profileSelectItem: SelectItem[];

  profileData: ProfileInfo[];

  ROUTING_PATH = ROUTING_PATH;

  ngOnInit() {
    this.selectedEntityArr = [CONS.TOPOLOGY.TOPOLOGY];
    //no need to call when store used [TO DO's]
    this.loadProfileList();
    this.loadTopologyData();

  }
  loadTopologyData(): void {
    this.getTableHeader();
    this.route.params.switchMap((params: Params) => this.configTopologyService.getTopologyDetail(+params['dcId'])).subscribe(data => this.topologyData = data);
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
    this.selectedEntityArr = [CONS.TOPOLOGY.TOPOLOGY];
    if (event.data.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
      this.currentEntity = CONS.TOPOLOGY.TIER;
      this.topologyData.filter(row => { if (row.topoId == event.data.nodeId) this.topologyEntity = row })
      this.configTopologyService.getTierDetail(event.data.nodeId, this.topologyEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr.push(CONS.TOPOLOGY.TIER);
    }
    else if (event.data.currentEntity == CONS.TOPOLOGY.TIER) {
      //this.selectedTopologyData :TierInfo[];
      this.currentEntity = CONS.TOPOLOGY.SERVER;
      this.topologyData.filter(row => { if (row.tierId == event.data.nodeId) this.tierEntity = row })
      this.configTopologyService.getServerDetail(event.data.nodeId, this.tierEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr.push(CONS.TOPOLOGY.TIER, CONS.TOPOLOGY.SERVER);
    }
    else if (event.data.currentEntity == CONS.TOPOLOGY.SERVER) {
      this.currentEntity = CONS.TOPOLOGY.INSTANCE;
      this.topologyData.filter(row => { if (row.serverId == event.data.nodeId) this.serverEntity = row })
      this.configTopologyService.getInstanceDetail(event.data.nodeId, this.serverEntity).subscribe(data => this.topologyData = data);
      this.selectedEntityArr.push(CONS.TOPOLOGY.TIER, CONS.TOPOLOGY.SERVER, CONS.TOPOLOGY.INSTANCE);
    }
    
    this.selectedEntityArr = [this.selectedEntityArr.join("> ")];
    //For Table header Name
    this.getTableHeader();
  }

  /**For Display table header object */
  getTableHeader(): void {
    let tableHeaderInfo = [];

    //Default for topology detail
    let colField;
    let colHeader = ["Name", "Description", "Profile Applied"];
    if (this.currentEntity == CONS.TOPOLOGY.TOPOLOGY) {
      colHeader = ["Name",  "Profile Applied"];
      colField = ["topoName", "profileName"];
    }

    else if (this.currentEntity == CONS.TOPOLOGY.TIER) {
      colHeader = ["Name", "Description", "Profile Applied"];
      colField = ["tierName", "tierDesc", "profileName"];
    }
    else if (this.currentEntity == CONS.TOPOLOGY.SERVER) {
       colHeader = ["Display Name", "Actual Name", "Profile Applied"];
       colField = ["serverDisplayName", "serverName", "profileName"];
    }
    else if (this.currentEntity == CONS.TOPOLOGY.INSTANCE) {
      colHeader = ["Display Name", " Name","Description", "Profile Applied","Enabled"];
      colField = ["instanceDisplayName", "instanceName", "instanceDesc","profileName", "enabled"];
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

  saveEditProfile():void{
    console.log("saveEditProfile method called--",this.topoData)
     if(this.currentEntity == CONS.TOPOLOGY.TOPOLOGY)
        this.configTopologyService.updateAttachedProfTopo(this.topoData).subscribe(data => {this.updateTopo(data) })
     else if(this.currentEntity == CONS.TOPOLOGY.TIER)
        this.configTopologyService.updateAttachedProfTier(this.topoData).subscribe(data => {this.updateTopo(data)})
     else if(this.currentEntity == CONS.TOPOLOGY.SERVER)
        this.configTopologyService.updateAttachedProfServer(this.topoData).subscribe(data => {this.updateTopo(data)})
     else if(this.currentEntity == CONS.TOPOLOGY.INSTANCE)
        this.configTopologyService.updateAttachedProfInstance(this.topoData).subscribe(data => {this.updateTopo(data)})

        this.configUtilityService.successMessage("Saved Successfully");
  }


  //in this method we are updating current table data with new values
  updateTopo(data) {
    console.log("updateTopo method called--", data)
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
    this.profileSelectItem.push({ value: -1, label: '--Select Profile--' });
    console.log("this.profileData---", data)
    let that = this;
    data.forEach(function (val) {
      that.profileSelectItem.push({ value: val.profileId, label: val.profileName });
    })

  }

  // routeToConfiguration(selectedProfileId, selectedProfileName) {
  //   //Observable profile name
  //   this.configProfileService.profileNameObserver(selectedProfileName);
  //   this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  // }

  routeToConfiguration(entity) {
    console.log("entity--routeToConfiguration---", entity)
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
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', entity.profileId]);
  }

  disableProfInstance(instanceId, flag){

    this.configTopologyService.disableProfInstance(instanceId, flag).subscribe(data => {
        if(data.enabled == "true"){
          this.configUtilityService.infoMessage("Instance Enabled Sucessfully.");
        }
        else{
          this.configUtilityService.infoMessage("Instance Disabled Sucessfully.");
        }
    });
  }
}
