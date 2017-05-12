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


  subscription: Subscription;

  constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService, private store: Store<Object>) {

    this.subscription = this.store.select("keywordData").subscribe(data => {
      this.createDataForTable(data)
    });
  }

  //constructing tableData for table [all custom keywords list]

  createDataForTable(data) {
    let tableData = [];
    this.customKeywordsList = [];
    this.customKeywordsList.push({ value: -1, label: '--Select --' });
    for (let key in data) {
      if (data[key]['type'] == 'custom') {
        this.customKeywords = new CustomKeywordsComponentData();
        this.customKeywords.id = data[key]["keyId"];
        this.customKeywords.keywordName = key;
        this.customKeywords.value = data[key]["value"];
        this.customKeywords.description = data[key]['desc'];
        this.customKeywords.enable = data[key]['enable'];
        tableData.push(this.customKeywords);
        this.customKeywordsList.push({ 'value': key, 'label': key});
      }
      else if(data[key]['type'] == 'pre-custom'){
          this.customKeywordsList.push({ 'value': key, 'label': key});
      }
    }
    this.customKeywordsDataList = tableData
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => { this.profileId = params['profileId']; })
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
  enableKeyword(keyword) {
    this.configKeywordsService.keywordData[keyword.keywordName].enable = !keyword.enable;
    this.configKeywordsService.saveProfileKeywords(this.profileId);
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

    //To check that keyword name already exists or not
    for (var i = 0; i < this.customKeywordsDataList.length; i++) {
      //checking (isNew) for handling the case of edit functionality
      if (this.isNew && this.customKeywordsDataList[i].keywordName == this.customKeywords.keywordName) {
        this.configUtilityService.errorMessage("Keyword name already exists");
        return true;
      }
    }



    for (let key in this.configKeywordsService.keywordData) {
      if( key == this.customKeywords.keywordName){
          this.configKeywordsService.keywordData[key].value = this.customKeywords.value;
          this.configKeywordsService.keywordData[key].desc = this.customKeywords.description;
          this.configKeywordsService.keywordData[key].type = "custom";
          this.configKeywordsService.keywordData[key].enable = true;
          keywordExistFlag = true;
      }
    }
    if (!keywordExistFlag) {
      this.configUtilityService.errorMessage(customKeywordMessage);
      return;
    }
    this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.configUtilityService.successMessage(Messages);
    this.addEditDialog = false;
    this.isNew = false;
    this.selectedCustomKeywordsData = [];
  }
}
