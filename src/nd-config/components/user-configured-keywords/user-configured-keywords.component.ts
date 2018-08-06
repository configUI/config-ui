import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserConfiguredKeywords } from './../../containers/keyword-data';
import { ConfigUtilityService } from './../../services/config-utility.service';
import { ConfigKeywordsService } from './../../services/config-keywords.service';
import { deleteMany } from './../../utils/config-utility';
import { ConfigUiUtility } from './../../utils/config-utility';
import { SelectItem, ConfirmationService } from 'primeng/primeng'
import { ImmutableArray } from './../../utils/immutable-array';
import { Messages } from './../../constants/config-constant';


@Component({
  selector: 'app-user-configured-keywords',
  templateUrl: './user-configured-keywords.component.html',
  styleUrls: ['./user-configured-keywords.component.css']
})
export class UserConfiguredKeywordComponent implements OnInit {

  /** To store manually added custom keywords */
  usrConfiguredKeyList: UserConfiguredKeywords[];
  selectedUsrConfKeyList: UserConfiguredKeywords[];
  usrConfiguredKeyDetail: UserConfiguredKeywords;

  isNewUserDialog: boolean = false;

  /**To open/clode user configured keywords dialog */
  userDialog: boolean = false;

  message: string;

  agentMode: string[]

  //list holding keywordsNameList
  customKeywordsList = [];

  agentList: SelectItem[];
  keywordTypeList: SelectItem[];

  index: number = 0;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.loadUserConfiguredKeywordList()
  }

  handleChange(e) {
    this.index = e.index;
  }

  loadUserConfiguredKeywordList() {
    this.configKeywordsService.getUserConfiguredKeywords().subscribe(data => {
      this.usrConfiguredKeyList = data
    })
  }

  openUserDialog() {
    this.usrConfiguredKeyDetail = new UserConfiguredKeywords();
    this.keywordTypeList = []
    this.agentList = []
    this.userDialog = true;
    this.isNewUserDialog = true;
    this.loadAgentNames();
    this.loadKeywordType();
  }

  loadAgentNames() {
    this.agentList = [];
    let data = ['Java', 'NodeJS', 'DotNet']
    let value = ['0', '1', '2']
    for (let i = 0; i < data.length; i++)
      this.agentList.push({ label: data[i], value: value[i] });
  }

  // This method is used for get bit value of selected Component List like NDConfig, Montior and NDE scale is 7
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
    this.configKeywordsService.saveUserConfiguredKeywords(this.usrConfiguredKeyDetail).subscribe(data => {

      //If keyword is already present in table then it will return null
      if (data.keyId == null) {
        this.configUtilityService.errorMessage("Keyword is already configured from NDConfigUI")
        return;
      }
      else {
        this.usrConfiguredKeyList = ImmutableArray.push(this.usrConfiguredKeyList, data);
        this.configUtilityService.successMessage(Messages);
      }
    })
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
            this.configUtilityService.errorMessage("Delete Aborted: '" + this.selectedUsrConfKeyList[0].keyName + "' keyword is used in: " + res)
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
    if (this.usrConfiguredKeyDetail.min > this.usrConfiguredKeyDetail.max) {
      min.setCustomValidity('Min value should be less than max Value.');
    }
    else if (this.usrConfiguredKeyDetail.min == this.usrConfiguredKeyDetail.max) {
      min.setCustomValidity('Min and Max values cannot be same.');
    }
    else {
      min.setCustomValidity('');
    }
    max.setCustomValidity('');

  }

  checkMax(min, max) {
    if (this.usrConfiguredKeyDetail.min > this.usrConfiguredKeyDetail.max) {
      max.setCustomValidity('Max value should be greater than min value.');
    }
    else if (this.usrConfiguredKeyDetail.min == this.usrConfiguredKeyDetail.max) {
      max.setCustomValidity('Min and Max values cannot be same.');
    }
    else {
      max.setCustomValidity('');
    }
    min.setCustomValidity('');
  }

  checkDefault(defaultVal) {
    if (this.usrConfiguredKeyDetail.min > this.usrConfiguredKeyDetail.defaultValue) {
      defaultVal.setCustomValidity('Defalut value should be greater than or equal to min value.');
    }
    else if (this.usrConfiguredKeyDetail.defaultValue > this.usrConfiguredKeyDetail.max) {
      defaultVal.setCustomValidity('Defalut value should be less than or equal to max value.');
    }
    else {
      defaultVal.setCustomValidity('');
    }
  
}

/**
* Purpose : To invoke the service responsible to open Help Notification Dialog 
* related to the current component.
*/
sendHelpNotification() {
  this.configKeywordsService.getHelpContent("Left Panel", "Agent Settings", "");
}
}