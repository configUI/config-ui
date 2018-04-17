import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ActivatedRoute, Params } from '@angular/router';
import { CustomKeywordsComponentData } from '../../../../containers/instrumentation-data';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { deleteMany } from '../../../../utils/config-utility';

import { Messages, descMsg, customKeywordMessage } from '../../../../constants/config-constant';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-custom-keywords',
  templateUrl: './custom-keywords.component.html',
  styleUrls: ['./custom-keywords.component.css']
})
export class CustomKeywordsComponent implements OnInit {

  @Input()
  profileId: number;

  @Input()
  saveDisable: boolean;

  @Output()
  keywordData = new EventEmitter();

  /**It stores custom keywords data */
  customKeywordsDataList: CustomKeywordsComponentData[];

  /**It stores selected method monitor data for edit or add method-monitor */
  customKeywords: CustomKeywordsComponentData;

  /**It stores selected custom keywords data */
  selectedCustomKeywordsData: CustomKeywordsComponentData[];

  /**For add/edit  flag */
  isNew: boolean = false;

  /**For open/close add/edit  */
  addEditDialog: boolean = false;

  //list holding keywordsNameList
  customKeywordsList = [];

  javaCustomKeywordsList = ["ASDataBufferMinCount", "ASStackCompareOption", "enableExceptionInSeqBlob", "maxQueryDetailMapSize", "AgentTraceLevel", "maxResourceDetailMapSize", "maxExceptionMessageLength", "ASResumeDataBuffFreePct", "ndHttpHdrCaptureFileList", "NDHTTPReqHdrCfgListFullFp", "NDHTTPRepHdrCfgListFullFp", "NDHTTPRepHdrCfgListL1Fp", "ASTraceLevel"];
  nodeJsCustomKeywordsList = ["ndExceptionFilterList", "enableBackendMonTrace", "enableForcedFPChain", "captureHttpTraceLevel", "maxCharInSeqBlob", "bciMaxNonServiceMethodsPerFP", "bciDataBufferMaxCount", "bciDataBufferMaxSize", "ASDataBufferSize", "ASDataBufferMaxCount", "NVCookie"];
  dotNetCustomKeywordsList = ["NDHTTPRepHdrCfgListFullFp", "NDHTTPReqHdrCfgListFullFp", "NDHTTPRepHdrCfgListL1Fp", "NDAppLogFile", "ndBackendMonFile", "generateExceptionConfFile", "cavNVURLFile", "NDInterfaceFile", "enableBackendMonTrace", "genNewMonRecord", "BTAggDataArraySize", "AppLogTraceLevel", "ControlThreadTraceLevel", "AgentTraceLevel", "BCITraceMaxSize", "ndHttpHdrCaptureFileList", "ASEnableHotspotRecord", "NVCookie", "doNotDiscardFlowPaths"];

  subscription: Subscription;

  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;
  isCustomConfigurationBrowse: boolean = false;

  isValueDisabled: boolean = false;

  agentType: string = "";
  isProfilePerm: boolean;

  custom_keyword: object;

  customKeywordData:boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService, private store: Store<Object>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      this.agentType = sessionStorage.getItem("agentType");
      this.createDataForTable(data)
      var keywordDataVal = {}
      if(this.agentType == "Java"){
        this.javaCustomKeywordsList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
      }
      else if(this.agentType == "NodeJS"){
        this.nodeJsCustomKeywordsList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
      }
      else if(this.agentType == "Dot Net"){
        this.dotNetCustomKeywordsList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
      }
      this.custom_keyword = keywordDataVal;
    });

  }

  //constructing tableData for table [all custom keywords list]

  createDataForTable(data) {
    let tableData = [];
    this.customKeywordsList = [];
    // this.customKeywordsList.push({ value: -1, label: '--Select --' });
    for (let key in data) {
      if (!(data[key]['assocId'] == -1) && data[key]['enable'] == true && (data[key]['type'] == 'custom' || data[key]['type'] == 'pre-custom')) {
        this.customKeywords = new CustomKeywordsComponentData();
        this.customKeywords.id = data[key]["keyId"];
        this.customKeywords.keywordName = key;
        this.customKeywords.value = data[key]["value"];
        this.customKeywords.description = data[key]['desc'];
        this.customKeywords.enable = data[key]['enable'];
        tableData.push(this.customKeywords);
        // this.customKeywordsList.push({ 'value': key, 'label': key});
      }
      else if (data[key]['type'] == 'pre-custom' || data[key]['type'] == 'custom') {
        //  this.customKeywordsList.push({ 'value': key, 'label': key});
      }
    }
    if (this.agentType == "Java") {
      for (let i = 0; i < this.javaCustomKeywordsList.length; i++) {
        this.customKeywordsList.push({ 'value': this.javaCustomKeywordsList[i], 'label': this.javaCustomKeywordsList[i] });
      }
    }

    if (this.agentType == "NodeJS") {
      for (let i = 0; i < this.nodeJsCustomKeywordsList.length; i++) {
        this.customKeywordsList.push({ 'value': this.nodeJsCustomKeywordsList[i], 'label': this.nodeJsCustomKeywordsList[i] });
      }
    }

    if (this.agentType == "Dot Net") {
      for (let i = 0; i < this.dotNetCustomKeywordsList.length; i++) {
        this.customKeywordsList.push({ 'value': this.dotNetCustomKeywordsList[i], 'label': this.dotNetCustomKeywordsList[i] });
      }
    }
    this.customKeywordsDataList = tableData
  }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => { this.profileId = params['profileId']; })
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.uploadFile(data);
    });
  }

  /**For showing add  dialog */
  openAddDialog(): void {
    this.customKeywords = new CustomKeywordsComponentData();
    this.isNew = true;
    this.addEditDialog = true;
  }

  /**For showing edit dialog */
  openEditDialog(): void {
    if (!this.selectedCustomKeywordsData || this.selectedCustomKeywordsData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedCustomKeywordsData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    this.customKeywords = new CustomKeywordsComponentData();
    this.isNew = false;
    this.addEditDialog = true;
    this.customKeywords = Object.assign({}, this.selectedCustomKeywordsData[0]);
  }

  //enabling /disabling keyword in ndsettings.txt
  // enableKeyword(keyword) {
  //   this.configKeywordsService.keywordData[keyword.keywordName].enable = !keyword.enable;
  //   this.configKeywordsService.saveProfileKeywords(this.profileId); 
  // }
 
  // This method is used to delete(disable) the keyword
  deleteCustomKeywords(){
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        for(let key in this.custom_keyword){
          for(let i =0;i<this.selectedCustomKeywordsData.length;i++){
            if(key == this.selectedCustomKeywordsData[i].keywordName){
              this.custom_keyword[key].enable = false;
              this.custom_keyword[key].value = this.custom_keyword[key].defaultValue;
            }
          }
        }
        for(let key in this.custom_keyword){
          this.configKeywordsService.keywordData[key] = this.custom_keyword[key];
        }
        
        this.configKeywordsService.saveProfileCustomKeywords(this.profileId);
        this.selectedCustomKeywordsData = [];
      },
      reject: () => {
      }
    });
  }

  /* After saving custom keywords,store is updated and constructor of this component
  * is called,where it created table data from the store which is now
  * updated .There by increasing length of tabledata by 1.i.e updating tabledata
  */

  saveCustomKeywords() {
    //flag used to determine if keyword entered by user exist in db or not
    let keywordExistFlag = false;
    let data = [];
    var keywordDataVal = {}

    //  Description field should not contain more than 500 characters
    if (this.customKeywords.description != null) {
      if (this.customKeywords.description.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }

    //Validation check for custom keywords
    if (this.customKeywords.keywordName == 'ASDataBufferMinCount') {
      if (+this.customKeywords.value < 2 || +this.customKeywords.value > 1024) {
        this.configUtilityService.errorMessage("Please enter value between 2 and 1024");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'maxQueryDetailMapSize') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 10000000) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 10000000");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ASStackCompareOption') {
      if (+this.customKeywords.value < 1 || +this.customKeywords.value > 2) {
        this.configUtilityService.errorMessage("Please enter value between 1 and 2");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'enableExceptionInSeqBlob') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 1) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 1");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'AgentTraceLevel') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 4) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 4");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ASTraceLevel') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 20) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 20");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'maxExceptionMessageLength') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 10000) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 10000");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'maxResourceDetailMapSize') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 1000000) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 1000000");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ASResumeDataBuffFreePct') {
      if (+this.customKeywords.value < 1 || +this.customKeywords.value > 100) {
        this.configUtilityService.errorMessage("Please enter value between 1 and 100");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ndExceptionFilterList') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 10240) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 10240");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'enableBackendMonTrace') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 6) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 6");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'enableForcedFPChain') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 3) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 3");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'captureHttpTraceLevel') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 6) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 6");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'maxCharInSeqBlob') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 1024000000) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 1024000000");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'bciMaxNonServiceMethodsPerFP') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 2147483647) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 2147483647");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'bciDataBufferMaxCount') {
      if (+this.customKeywords.value < 1 || +this.customKeywords.value > 30000) {
        this.configUtilityService.errorMessage("Please enter value between 1 and 30000");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'bciDataBufferMaxSize') {
      if (+this.customKeywords.value < 128 || +this.customKeywords.value > 65536) {
        this.configUtilityService.errorMessage("Please enter value between 128 and 65536");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ASDataBufferSize') {
      if (+this.customKeywords.value < 1 || +this.customKeywords.value > 2147483647) {
        this.configUtilityService.errorMessage("Please enter value between 1 and 2147483647");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ASDataBufferMaxCount') {
      if (+this.customKeywords.value < 2 || +this.customKeywords.value > 1024) {
        this.configUtilityService.errorMessage("Please enter value between 2 and 1024");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'NVCookie') {
      if (+this.customKeywords.value < 2 || +this.customKeywords.value > 1048576) {
        this.configUtilityService.errorMessage("Please enter value between 2 and 1048576");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'genNewMonRecord') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 1) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 1");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'BTAggDataArraySize') {
      if (+this.customKeywords.value < 50 || +this.customKeywords.value > 5000) {
        this.configUtilityService.errorMessage("Please enter value between 50 and 5000");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'AppLogTraceLevel') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 6) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 6");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ControlThreadTraceLevel') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 4) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 4");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'AgentTraceLevel') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 4) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 4");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'BCITraceMaxSize') {
      if (+this.customKeywords.value < 1024 || +this.customKeywords.value > 1073741824) {
        this.configUtilityService.errorMessage("Please enter value between 1024 and 1073741824");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'ASEnableHotspotRecord') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 2) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 2");
        return;
      }
    }

    if (this.customKeywords.keywordName == 'doNotDiscardFlowPaths') {
      if (+this.customKeywords.value < 0 || +this.customKeywords.value > 1) {
        this.configUtilityService.errorMessage("Please enter value between 0 and 1");
        return;
      }
    }

    //To check that keyword name already exists or not
    for (var i = 0; i < this.customKeywordsDataList.length; i++) {
      //checking (isNew) for handling the case of edit functionality
      if (this.isNew && this.customKeywordsDataList[i].keywordName == this.customKeywords.keywordName) {
        this.configUtilityService.errorMessage("Keyword name already exists");
        return true;
      }
    }

    for (let key in this.custom_keyword) {
      if (key == this.customKeywords.keywordName) {
        this.custom_keyword[key].value = this.customKeywords.value;
        this.custom_keyword[key].desc = this.customKeywords.description;
        this.custom_keyword[key].type = "custom";
        this.custom_keyword[key].enable = true;
        keywordExistFlag = true;
      }
    }

    for(let key in this.custom_keyword){
      this.configKeywordsService.keywordData[key] = this.custom_keyword[key];
    } 

    this.configKeywordsService.saveProfileCustomKeywords(this.profileId);
    
    if (!keywordExistFlag) {
      this.configUtilityService.errorMessage(customKeywordMessage);
      return;
    }
  
    this.addEditDialog = false;
    this.isNew = false;
    this.selectedCustomKeywordsData = [];
  }

// This method is called when user click on the save button given in header field
  saveKeywordData(){
    this.keywordData.emit(this.custom_keyword);
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
  }

  openFileManager() {
    this.openFileExplorerDialog = true;
    this.isCustomConfigurationBrowse = true;
  }
  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isCustomConfigurationBrowse == true) {
      this.isCustomConfigurationBrowse = false;
      this.openFileExplorerDialog = false;
      this.customKeywords.value = filepath;
      this.isValueDisabled = true;
    }
  }
  
 /* change Browse boolean value on change component */
 ngOnDestroy() {
   this.isCustomConfigurationBrowse = false;
 }
}
