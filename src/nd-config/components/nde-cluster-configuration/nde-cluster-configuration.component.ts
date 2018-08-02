import { Component, OnInit, OnDestroy } from '@angular/core';
import { NDE, NDERoutingRules } from './../../containers/nde-cluster-data';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { Messages, descMsg, addMessage, editMessage } from '../../constants/config-constant'
import { ImmutableArray } from '../../utils/immutable-array';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { deleteMany } from '../../utils/config-utility';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-nde-cluster-configuration',
  templateUrl: './nde-cluster-configuration.component.html',
  styleUrls: ['./nde-cluster-configuration.component.css']
})
export class NDEClusterConfiguration implements OnInit, OnDestroy {


  // Object for Adding/editing NDE
  ndeInfo: NDE[];
  ndeData: NDE;
  selectedNDEData: NDE[];

  // Object for Adding/Editing NDERoutingRules
  ndeRoutingRulesInfo: NDERoutingRules[];
  ndeRoutingRulesData: NDERoutingRules;
  selectedNDERoutingRules: NDERoutingRules[];

  // To open/close add/edit NDE Dialog
  isNDE: boolean = false;
  addEditNDE: boolean = false;

  // To open/close add/edit NDE routing rules
  isNDERule: boolean = false;
  addEditNDERules: boolean = false;

  ndeListItem: SelectItem[];
  tierGrpList: SelectItem[];

  isMasterChk: boolean = false;

  disableMaster: boolean = false;
  isProfilePerm: boolean;

  tierGroupList: any = []

  constructor(private configUtilityService: ConfigUtilityService, private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false
    // Get NDE data
    this.getNDEData();
    this.loadTierGroupName();

    // Get NDE Routing rules data
    this.getNDERoutingRules();

  }

  // To load tier group names 
  loadTierGroupName() {
    this.tierGrpList = []
    this.configKeywordsService.getTierGroupNames().subscribe(data => {
      for (let i = 0; i < data.length; i++)
        this.tierGrpList.push({ label: data[i], value: data[i] });
    })
  }

  //  To get NDE DATA
  getNDEData() {
    this.configKeywordsService.getNDEData().subscribe(data => {
      this.ndeInfo = data
    })
  }

  // To load NDE Routing Rules data
  getNDERoutingRules() {
    this.configKeywordsService.getNDERoutingRulesData().subscribe(data => {
      this.ndeRoutingRulesInfo = data;
    })
  }

  //To open Add NDE dialog
  openNDEDialog() {
    this.ndeData = new NDE();

    this.isNDE = true;
    this.addEditNDE = true

    this.disableMaster = false;
    // Check if a master NDE is already created or not
    for (let i = 0; i < this.ndeInfo.length; i++) {
      if (this.ndeInfo[i].isMaster == "1") {
        this.disableMaster = true;
        this.isMasterChk = false;
        break;
      }
    }

  }

  // To open Edit NDE Dialog
  openEditNDEDialog() {
    if (!this.selectedNDEData || this.selectedNDEData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit")
      return;
    }
    else if (this.selectedNDEData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    else {
      this.ndeData = new NDE();
      // if (this.selectedNDEData[0].name != this.ndeData.name) {
      // Check if a master NDE is already created or not

      // }
      this.isNDE = false;
      this.addEditNDE = true;
      this.ndeData = Object.assign({}, this.selectedNDEData[0]);
      let flag = false
      for (let i = 0; i < this.ndeInfo.length; i++) {
        if (this.ndeInfo[i].isMaster == "1") {
          flag = true;
          break;
        }
      }

      if (flag && this.ndeData.isMaster == "1") {
        this.disableMaster = false;
        this.isMasterChk = true;
      }
      else if (this.selectedNDEData[0].isMaster == '0' && flag) {
        this.disableMaster = true;
        this.isMasterChk = false;
      }
      else if (!flag) {
        this.disableMaster = false;
      }

      if (this.ndeData.wsPort == "-") {
        this.ndeData.wsPort = "";
      }
      if (this.ndeData.wssPort == "-") {
        this.ndeData.wssPort = "";
      }

    }
  }

  // To save NDE
  saveEditNDE() {
    if (this.isNDE) {
      if (!this.checkNDENameAlreadyExist()) {
        this.saveNDE()
        return;
      }
    }
    else {
      this.editNDE();
    }
  }



  checkNDENameAlreadyExist(): boolean {
    for (let i = 0; i < this.ndeInfo.length; i++) {
      if (this.ndeInfo[i].name == this.ndeData.name) {
        this.configUtilityService.errorMessage("NDE Name already exists");
        return true;
      }
      if (this.ndeInfo[i].ip == this.ndeData.ip && this.ndeInfo[i].port == this.ndeData.port) {
        this.configUtilityService.errorMessage("Same NDE IP and Port already exists");
        return true;
      }
    }
  }

  checkNDRoutingAlreadyExist(): boolean {
    // if (this.ndeInfo.length != 0) {
    for (let i = 0; i < this.ndeRoutingRulesInfo.length; i++) {
      if (this.ndeRoutingRulesInfo[i].nde == this.ndeRoutingRulesData.nde) {
        this.configUtilityService.errorMessage("NDE Routing Rule already exists");
        return true;
      }
    }
    // }
  }

  // To edit NDE Data
  editNDE() {
    this.ndeData = this.modifyData(this.ndeData);

    for (let i = 0; i < this.ndeInfo.length; i++) {
      if (this.ndeData.name == this.selectedNDEData[0].name) { }
      else if (this.ndeInfo[i].name == this.ndeData.name) {
        this.configUtilityService.errorMessage("NDE Name already exists");
        return true;
      }

      if (this.ndeInfo[i].name != this.ndeData.name) {
        let strNDEInfo = this.ndeInfo[i].ip + ":" + this.ndeInfo[i].port;
        let strData = this.ndeData.ip + ":" + this.ndeData.port;
        if (strNDEInfo.trim() == strData.trim()) {
          this.configUtilityService.errorMessage("Same NDE IP and Port already exists");
          return;
        }
      }
    }

    this.configKeywordsService.editNDEData(this.ndeData).subscribe(data => {
      console.log("daaaataaaaa   ", data)
      let index = this.getNDEIndex();
      this.selectedNDEData.length = 0;
      this.ndeInfo = ImmutableArray.replace(this.ndeInfo, data, index);
      this.configUtilityService.successMessage(editMessage);
      this.addEditNDE = false

    })
  }

  getNDEIndex(): number {
    if (this.ndeData) {
      let id = this.ndeData.id;
      for (let i = 0; i < this.ndeInfo.length; i++) {
        if (this.ndeInfo[i].id == id) {
          return i;
        }
      }
    }
    return -1;
  }

  getNDERoutingIndex(): number {
    if (this.ndeRoutingRulesData) {
      let id = this.ndeRoutingRulesData.id;
      for (let i = 0; i < this.ndeRoutingRulesInfo.length; i++) {
        if (this.ndeRoutingRulesInfo[i].id == id) {
          return i;
        }
      }
    }
    return -1;
  }

  // To open NDE routing rules dialog
  openNDERoutingRules() {
    this.ndeRoutingRulesData = new NDERoutingRules();
    this.ndeRoutingRulesData.nde = new NDE();
    if (this.ndeInfo.length < 1) {
      this.configUtilityService.errorMessage("No NDE Server is present");
      return;
    }
    this.loadTierGroupName();
    this.isNDERule = true;
    this.addEditNDERules = true;
    this.tierGroupList = [];
  }

  // TO ADD/EDIT and NDE Routing rules
  saveEditNDERoutingRules() {
    if (this.isNDERule) {
      if (!this.checkNDRoutingAlreadyExist()) {
        this.saveNDERoutingRules()
        return;
      }
    }
    else {
      if (this.selectedNDERoutingRules[0].nde != this.ndeRoutingRulesData.nde) {
        if (this.checkNDRoutingAlreadyExist())
          return;
      }
      this.editNDERoutingRules();
    }
  }

  // To edit NDE Routing rules
  editNDERoutingRules() {
    this.configKeywordsService.getNDEServerFromNDEName(this.ndeRoutingRulesData.nde.name).subscribe(res => {
      this.ndeRoutingRulesData.nde = res;
      this.ndeRoutingRulesData.tierGroup = this.tierGroupList.join(",")
      this.configKeywordsService.editNDERoutingRules(this.ndeRoutingRulesData).subscribe(data => {
        let index = this.getNDERoutingIndex();
        this.selectedNDERoutingRules.length = 0;
        this.ndeRoutingRulesInfo = ImmutableArray.replace(this.ndeRoutingRulesInfo, data, index);
        this.configUtilityService.successMessage(editMessage);
        this.addEditNDERules = false

      })
    })

  }

  // To save/edit NDE Routing Rules
  saveNDERoutingRules() {

    // Get NDE object from NDE server name
    this.configKeywordsService.getNDEServerFromNDEName(this.ndeRoutingRulesData.nde.name).subscribe(res => {
      console.log("get nde server ", res)
      this.ndeRoutingRulesData.nde = res;
      this.ndeRoutingRulesData.tierGroup = this.tierGroupList.join(",")
      this.configKeywordsService.saveNDERoutingRules(this.ndeRoutingRulesData).subscribe(data => {
        this.ndeRoutingRulesInfo = ImmutableArray.push(this.ndeRoutingRulesInfo, data);
        this.configUtilityService.successMessage(Messages);
      })
      this.addEditNDERules = false
    })

  }

  // Save NDE 
  saveNDE() {
    this.ndeData = this.modifyData(this.ndeData)
    this.configKeywordsService.saveNDEData(this.ndeData).subscribe(data => {

      this.ndeInfo = ImmutableArray.push(this.ndeInfo, data);
      this.configUtilityService.successMessage(Messages);
    })
    this.addEditNDE = false
  }

  // To delete NDE
  deleteNDE() {
    if (!this.selectedNDEData || this.selectedNDEData.length < 1) {
      this.configUtilityService.errorMessage("Select a NDE Server to delete")
      return;
    }
    if (this.selectedNDEData.length > 1) {
      this.configUtilityService.errorMessage("Select only one NDE Server to delete")
      return;
    }

    //Check if selected NDE Server has any routing rules or not, if yes then do not allow delete
    for (let obj of this.ndeRoutingRulesInfo) {
      if (obj.nde.name == this.selectedNDEData[0].name) {
        this.configUtilityService.errorMessage("NDE Routing rule is configured for NDE Server '" + this.selectedNDEData[0].name + "' ")
        return;
      }
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected body's id
        let selectedApp = this.selectedNDEData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].id);
        }
        this.configKeywordsService.deleteNDEData(arrAppIndex)
          .subscribe(data => {
            this.deleteNDEIndex(arrAppIndex);
            this.selectedNDEData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }

  /**This method is used to delete body from Data Table */
  deleteNDEIndex(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getNDEDataIndex(arrIndex[index]));
    }
    this.ndeInfo = deleteMany(this.ndeInfo, rowIndex);
  }

  /**This method is used to delete body from Data Table */
  deleteNDERoutingRulesIndex(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getNDERoutingRulesDataIndex(arrIndex[index]));
    }
    this.ndeRoutingRulesInfo = deleteMany(this.ndeRoutingRulesInfo, rowIndex);
  }

  /**This method returns selected body row on the basis of selected row */
  getNDEDataIndex(appId: any): number {
    for (let i = 0; i < this.ndeInfo.length; i++) {
      if (this.ndeInfo[i].id == appId) {
        return i;
      }
    }
    return -1;
  }

  /**This method returns selected body row on the basis of selected row */
  getNDERoutingRulesDataIndex(appId: any): number {
    for (let i = 0; i < this.ndeRoutingRulesInfo.length; i++) {
      if (this.ndeRoutingRulesInfo[i].id == appId) {
        return i;
      }
    }
    return -1;
  }

  // To load list of NDE to show in dropdown
  loadNDEList() {
    // this.ndeListItem = []
    // for (let i = 0; i < this.ndeInfo.length; i++) {
    //   this.ndeListItem.push({ label: this.ndeInfo[i].name, value: this.ndeInfo[i].name });
    // }

    this.ndeListItem = [];
    for (let i = 0; i < this.ndeInfo.length; i++) {
      let flag = true;
      for (let j = 0; j < this.ndeRoutingRulesInfo.length; j++) {
        if (this.ndeInfo[i].name == this.ndeRoutingRulesInfo[j].nde.name) {
          flag = false;
          break;
        }
      }
      if (flag) {
        this.ndeListItem.push({ label: this.ndeInfo[i].name, value: this.ndeInfo[i].name });
      }
    }
    if (!this.isNDERule) {
      this.ndeListItem.push({ label: this.selectedNDERoutingRules[0].nde.name, value: this.selectedNDERoutingRules[0].nde.name });
    }
  }

  ngOnDestroy(): void {
  }

  // Save values of WS and WSS port as - by default
  modifyData(data: NDE) {
    if (data.wsPort == "" || data.wsPort == null) {
      data.wsPort = "-"
    }
    if (data.wssPort == "" || data.wssPort == null) {
      data.wssPort = "-"
    }

    // Setting isMaster value to 0/1
    if (this.isMasterChk == true) {
      data.isMaster = "1"
    }
    else {
      data.isMaster = "0"
    }

    return data;
  }

  deleteNDERoutingRules() {
    if (!this.selectedNDERoutingRules || this.selectedNDERoutingRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to delete")
      return;
    }
    if (this.selectedNDERoutingRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to delete")
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected body's id
        let selectedApp = this.selectedNDERoutingRules;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].id);
        }
        this.configKeywordsService.deleteNDERoutingRules(arrAppIndex)
          .subscribe(data => {
            this.deleteNDERoutingRulesIndex(arrAppIndex);
            this.selectedNDERoutingRules = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }

  // Open edit NDE Routing rules
  openEditNDERoutingDialog() {
    if (!this.selectedNDERoutingRules || this.selectedNDERoutingRules.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit")
      return;
    }
    else if (this.selectedNDERoutingRules.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    else {
      this.isNDERule = false;
      this.addEditNDERules = true;
      this.loadNDEList()
      this.ndeRoutingRulesData = new NDERoutingRules();
      // this.tierGrpList = [];
      this.ndeRoutingRulesData = Object.assign({}, this.selectedNDERoutingRules[0]);
      let tierGroupList = this.ndeRoutingRulesData.tierGroup.split(",");


      for (let i = 0; i < tierGroupList.length; i++) {
        let flag = true;
        for (let j = 0; j < this.tierGrpList.length; j++) {
          if (tierGroupList[i] == this.tierGrpList[j].label.trim()) {
            flag = false;
            break;
          }
        }
        if (flag) {
          this.tierGrpList.push({ label: tierGroupList[i], value: tierGroupList[i] });
        }
      }
      this.tierGroupList = tierGroupList;
    }
  }
}

@Pipe({ name: 'ndeName' })
export class PipeForObject implements PipeTransform {

  transform(value: NDE): string {
    let label = "";
    label = value.name;

    return label;
  }

}
