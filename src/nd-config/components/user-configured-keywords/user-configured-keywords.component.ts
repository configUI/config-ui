import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserConfiguredKeywords, UserConfiguredNDCKeywords } from './../../containers/keyword-data';
import { ConfigUtilityService } from './../../services/config-utility.service';
import { ConfigKeywordsService } from './../../services/config-keywords.service';
import { deleteMany } from './../../utils/config-utility';
import { ConfigUiUtility } from './../../utils/config-utility';
import { SelectItem, ConfirmationService } from 'primeng/primeng'
import { ImmutableArray } from './../../utils/immutable-array';
import { Messages, editMessage } from './../../constants/config-constant';
import { PipeForType } from '../../pipes/config-pipe.pipe'


@Component({
  selector: 'app-user-configured-keywords',
  templateUrl: './user-configured-keywords.component.html',
  styleUrls: ['./user-configured-keywords.component.css']
})
export class UserConfiguredKeywordComponent implements OnInit {

  /** To store manually added BCI custom keywords */
  usrConfiguredKeyList: UserConfiguredKeywords[];
  selectedUsrConfKeyList: UserConfiguredKeywords[];
  usrConfiguredKeyDetail: UserConfiguredKeywords;

  /** To store manually added NDC custom keywords */
  usrConfiguredNDCKeyList: UserConfiguredNDCKeywords[];
  selectedUsrConfNDCKeyList: UserConfiguredNDCKeywords[];
  usrConfiguredNDCKeyDetail: UserConfiguredNDCKeywords;


  isNewUserDialog: boolean = false;
  isNewUserNDCDialog: boolean = false;

  /**To open/clode user configured keywords dialog */
  userDialog: boolean = false;
  userNDCDialog: boolean = false;

  message: string;

  agentMode: string[]

  //list holding keywordsNameList
  customKeywordsList = [];

  agentList: SelectItem[];
  keywordTypeList: SelectItem[];
  ndcType: SelectItem[];

  index: number = 0;
  isProfilePerm: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private pipeForType: PipeForType) {

  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false
    this.loadUserConfiguredBCIKeywordList();
    this.loadUserConfiguredNDCKeywordList();
  }

  handleChange(e) {
    this.index = e.index;
  }

  loadUserConfiguredBCIKeywordList() {
    this.configKeywordsService.getUserConfiguredKeywords().subscribe(data => {
      this.usrConfiguredKeyList = data
    })
  }

  loadUserConfiguredNDCKeywordList() {
    this.configKeywordsService.getUserConfiguredNDCKeywords().subscribe(data => {
      this.usrConfiguredNDCKeyList = data
      for(let obj of this.usrConfiguredNDCKeyList){
        this.pipeForType.transform(obj.type)

      }
    })
  }

  openUserBCIDialog() {
    this.usrConfiguredKeyDetail = new UserConfiguredKeywords();
    this.agentMode = []
    this.keywordTypeList = []
    this.agentList = []
    this.userDialog = true;
    this.isNewUserDialog = true;
    this.loadAgentNames();
    this.loadKeywordType();
  }

  openUserNDCDialog() {
    this.usrConfiguredNDCKeyDetail = new UserConfiguredNDCKeywords();
    this.ndcType = []
    this.userNDCDialog = true;
    this.isNewUserNDCDialog = true;
    this.loadNDCType()
  }


  loadAgentNames() {
    this.agentList = [];
    let data = ['Java', 'NodeJS', 'DotNet']
    let value = ['0', '1', '2']
    for (let i = 0; i < data.length; i++)
      this.agentList.push({ label: data[i], value: value[i] });
  }

  loadNDCType(){
    this.ndcType = [];
    let data = ['NDP', 'NDC']
    let value = ['NDP#', 'NDC#']
    for (let i = 0; i < data.length; i++)
      this.ndcType.push({ label: data[i], value: value[i] });
  }

  // This method is used for get bit value of selected Component List like Java, NodeJS and DotNet is 7
  getBitValueFromAgentList() {
    let agentValue = 0;
    for (let i = 0; i < this.agentMode.length; i++) {
      agentValue += Math.pow(2, +this.agentMode[i]);
    }
    this.usrConfiguredKeyDetail.agentMode = agentValue.toString();
  }
  
  loadKeywordType() {
    this.keywordTypeList = [];
    let typeLabel = ["Char", "Integer", "Double", "Long", "String", "File"];
    let typeVal = ["1", "2", "3", "4", "5", "6"];
    this.keywordTypeList = ConfigUiUtility.createListWithKeyValue(typeLabel, typeVal);
  }

  /** To save user configured keyowrds in database(config.keywords table) */
  saveUserKeywords() {
    this.getBitValueFromAgentList();
    if(this.isNewUserDialog){
    this.addUserKeywords();
    }
    else{
      this.editAgentKeyword();
    }
  }

  editAgentKeyword(){
    
    this.configKeywordsService.checkIfKeywordIsAssoc(this.selectedUsrConfKeyList[0].keyId).subscribe(res => {

      if (res.length == 0) {
    this.configKeywordsService.editAgentKeyword(this.usrConfiguredKeyDetail).subscribe(data => {
      this.usrConfiguredKeyList.map(function (val) {
        if (val.keyId == data.keyId) {
            val.agentMode = data.agentMode;
            val.kmdId = data.kmdId;
            val.keyName = data.keyName;
            val.min = data.min;
            val.max = data.max;
            val.defaultValue = data.defaultValue;
            val.desc = data.desc;
            val.type = data.type;
        }
      });
      this.configUtilityService.successMessage(editMessage)
    })
  }
  
  else {
    this.configUtilityService.errorMessage("Edit Aborted: '" + this.selectedUsrConfKeyList[0].keyName + "' setting is used in profile '" + res + "'")
  }
});

    this.userDialog = false
  }

  private addUserKeywords() {
    this.configKeywordsService.saveUserConfiguredKeywords(this.usrConfiguredKeyDetail).subscribe(data => {
      //If keyword is already present in table then it will return null
      if (data.keyId == null) {
        this.configUtilityService.errorMessage("User Configured Settings already exists");
        return;
      }
      else {
        this.usrConfiguredKeyList = ImmutableArray.push(this.usrConfiguredKeyList, data);
        this.configUtilityService.successMessage(Messages);
      }
    });
    this.userDialog = false;
  }

  deleteUserKeywords() {
    if (!this.selectedUsrConfKeyList || this.selectedUsrConfKeyList.length < 1) {
      this.configUtilityService.errorMessage("Select a keyword to delete")
      return;
    }
    if (this.selectedUsrConfKeyList.length > 1) {
      this.configUtilityService.errorMessage("Select only one keyword to delete")
      return;
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected body's id
        let selectedApp = this.selectedUsrConfKeyList;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].keyId);
        }

        this.configKeywordsService.checkIfKeywordIsAssoc(arrAppIndex).subscribe(res => {

          if (res.length == 0) {
            this.configKeywordsService.deleteUserConfiguredKeywords(arrAppIndex)
              .subscribe(data => {
                this.deleteNDEIndex(arrAppIndex);
                this.selectedUsrConfKeyList = [];
                this.configUtilityService.infoMessage("Deleted Successfully");
              });
          }
          else {
            this.configUtilityService.errorMessage("Delete Aborted: '" + this.selectedUsrConfKeyList[0].keyName + "' setting is used in profile '" + res + "'")
          }
        });
      },
      reject: () => {
      }
    })
  }

  /**This method is used to delete keyword from Data Table */
  deleteNDEIndex(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getNDEDataIndex(arrIndex[index]));
    }
    this.usrConfiguredKeyList = deleteMany(this.usrConfiguredKeyList, rowIndex);
  }


  /**This method returns selected body row on the basis of selected row */
  getNDEDataIndex(appId: any): number {
    for (let i = 0; i < this.usrConfiguredKeyList.length; i++) {
      if (this.usrConfiguredKeyList[i].keyId == appId) {
        return i;
      }
    }
    return -1;
  }

  checkMin(min, max) {
    if (+this.usrConfiguredKeyDetail.min > +this.usrConfiguredKeyDetail.max) {
      min.setCustomValidity('Min value should be less than max Value.');
    }
    else if (+this.usrConfiguredKeyDetail.min == +this.usrConfiguredKeyDetail.max) {
      min.setCustomValidity('Min and Max values cannot be same.');
    }
    else {
      min.setCustomValidity('');
    }
    max.setCustomValidity('');

  }

  checkMax(min, max, defaultVal) {
    if (+this.usrConfiguredKeyDetail.min > +this.usrConfiguredKeyDetail.max) {
      max.setCustomValidity('Max value should be greater than min value.');
    }
    else if (+this.usrConfiguredKeyDetail.min == +this.usrConfiguredKeyDetail.max) {
      max.setCustomValidity('Min and Max values cannot be same.');
    }
    else {
      max.setCustomValidity('');
    }
    min.setCustomValidity('');

    // For default value input box
    if (+this.usrConfiguredKeyDetail.min > +this.usrConfiguredKeyDetail.defaultValue) {
      defaultVal.setCustomValidity('Default value should be greater than or equal to min value.');
    }
    else if (+this.usrConfiguredKeyDetail.defaultValue > +this.usrConfiguredKeyDetail.max) {
      defaultVal.setCustomValidity('Defalut value should be less than or equal to max value.');
    }
    else {
      defaultVal.setCustomValidity('');
    }
  }

  checkDefault(defaultVal) {


  }

  /** To save NDC keywords */
  saveNDCKeywords() {
    if(this.isNewUserNDCDialog)
      this.addNDCKeywords();
    else{
      this.editNDCKeywords();
    }
  }

  private addNDCKeywords() {
    this.configKeywordsService.saveUserConfiguredNDCKeywords(this.usrConfiguredNDCKeyDetail).subscribe(data => {
      if (data.keyId == null) {
        this.configUtilityService.errorMessage("User Configured Settings already exists");
        return;
      }
      else {
        this.usrConfiguredNDCKeyList = ImmutableArray.push(this.usrConfiguredNDCKeyList, data);
        this.configUtilityService.successMessage(Messages);
      }
    });
    this.userNDCDialog = false;
  }

  editNDCKeywords(){
    this.configKeywordsService.checkIfNDCKeywordIsAssoc(this.selectedUsrConfNDCKeyList[0].keyId).subscribe(res => {
      if(res.length == 0){
    this.configKeywordsService.editNDCKeyword(this.usrConfiguredNDCKeyDetail).subscribe(data => {
      this.usrConfiguredNDCKeyList.map(function (val) {
        if (val.keyId == data.keyId) {
            val.desc = data.desc;
            val.keyName = data.keyName;
            val.min = data.min;
            val.max = data.max;
            val.defaultValue = data.defaultValue;
            val.type = data.type;
        }
      });
      this.configUtilityService.successMessage(editMessage)
    })
  }
  else {
    this.configUtilityService.errorMessage("Edit Aborted: '" + this.selectedUsrConfNDCKeyList[0].keyName + "' setting is used in Application '" + res + "'")
  }

  
}); 
    this.userNDCDialog = false; 
  }

  deleteNDCKeywords() {
    if (!this.selectedUsrConfNDCKeyList || this.selectedUsrConfNDCKeyList.length < 1) {
      this.configUtilityService.errorMessage("Select a keyword to delete")
      return;
    }
    if (this.selectedUsrConfNDCKeyList.length > 1) {
      this.configUtilityService.errorMessage("Select only one keyword to delete")
      return;
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected body's id
        let selectedApp = this.selectedUsrConfNDCKeyList;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].keyId);
        }
        this.configKeywordsService.checkIfNDCKeywordIsAssoc(arrAppIndex).subscribe(res => {
          if(res.length == 0){
          this.configKeywordsService.deleteUserConfiguredNDCKeywords(arrAppIndex)
          .subscribe(data => {
            this.deleteNDCIndex(arrAppIndex);
            this.selectedUsrConfNDCKeyList = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          });
        }
        else {
          this.configUtilityService.errorMessage("Delete Aborted: '" + this.selectedUsrConfNDCKeyList[0].keyName + "' setting is used in Application '" + res + "'")
        }
        })
      },
      reject: () => {
      }
    })
  }

    /**This method is used to delete keyword from Data Table */
    deleteNDCIndex(arrIndex) {
      let rowIndex: number[] = [];
  
      for (let index in arrIndex) {
        rowIndex.push(this.getNDCDataIndex(arrIndex[index]));
      }
      this.usrConfiguredNDCKeyList = deleteMany(this.usrConfiguredNDCKeyList, rowIndex);
    }

    
  /**This method returns selected body row on the basis of selected row */
  getNDCDataIndex(appId: any): number {
    for (let i = 0; i < this.usrConfiguredNDCKeyList.length; i++) {
      if (this.usrConfiguredNDCKeyList[i].keyId == appId) {
        return i;
      }
    }
    return -1;
  }

  /**
  * Purpose : To invoke the service responsible to open Help Notification Dialog 
  * related to the current component.
  */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Left Panel", "Agent Settings", "");
  }

  sendNDCHelpNotification() {
    this.configKeywordsService.getHelpContent("Left Panel", "NDC Settings", "");
  }

    /**For showing edit dialog */
    openEditAgentDialog(): void {
      if (!this.selectedUsrConfKeyList || this.selectedUsrConfKeyList.length < 1) {
        this.configUtilityService.errorMessage("Select a row to edit");
        return;
      }
      else if (this.selectedUsrConfKeyList.length > 1) {
        this.configUtilityService.errorMessage("Select only one row to edit");
        return;
      }
      this.loadAgentNames();
      this.getComponentValueFromBitValue(this.selectedUsrConfKeyList[0])
      this.loadKeywordType();
      this.isNewUserDialog = false;
      this.userDialog = true;
      this.usrConfiguredKeyDetail = Object.assign({}, this.selectedUsrConfKeyList[0]);
    }

    /**For showing edit NDC dialog */
    openEditNDCDialog(): void {
      if (!this.selectedUsrConfNDCKeyList || this.selectedUsrConfNDCKeyList.length < 1) {
        this.configUtilityService.errorMessage("Select a row to edit");
        return;
      }
      else if (this.selectedUsrConfNDCKeyList.length > 1) {
        this.configUtilityService.errorMessage("Select only one row to edit");
        return;
      }
      this.loadNDCType()
      this.isNewUserNDCDialog = false;
      this.userNDCDialog = true;
      this.usrConfiguredNDCKeyDetail = Object.assign({}, this.selectedUsrConfNDCKeyList[0]);
    }

    getComponentValueFromBitValue(data) {
      let agentBitVal = "";
          let agentVal = [];
          let strAgent = "";
          agentBitVal = parseInt(data.agentMode).toString(2);
          agentBitVal = agentBitVal.split("").reverse().join("");
          // this.objTierGroup.selectedComponentList = [];
          for (let i = 0; i < agentBitVal.length; i++) {
              if (agentBitVal[i] == "1") {
                  agentVal.push(i);
              }
            }
         this.agentMode = agentVal;
  }

}




