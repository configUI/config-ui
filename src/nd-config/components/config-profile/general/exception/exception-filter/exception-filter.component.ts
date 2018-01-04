import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { KeywordList } from '../../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigExceptionFilterService } from '../../../../../services/config-exceptionfilter.service';
import { EnableSourceCodeFilters } from '../../../../../containers/exception-capture-data';
import { cloneObject } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';

import { Messages } from '../../../../../constants/config-constant'

import { deleteMany } from '../../../../../utils/config-utility';


@Component({
  selector: 'app-exception-filter',
  templateUrl: './exception-filter.component.html',
  styleUrls: ['./exception-filter.component.css']
})
export class ExceptionFilterComponent implements OnInit {

  @Input()
  saveDisable: boolean;
  profileId: number;

  // @Input()
  // data;

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['enableSourceCodeFilters'];
  exceptionfilter: Object;
  selectedValues: boolean;
  keywordValue: Object;
  //for dialog open
  isNewExceptionFilter: boolean;
  addEditExceptionFilterDialog: boolean = false;

  /**It stores table data for showing in GUI */
  enableSourceCodeFiltersTableData: EnableSourceCodeFilters[];

  selectedExceptionFilterData: EnableSourceCodeFilters[];

  //exceptionFilterData: EnableSourceCodeFilters;


  /**It stores selected data for edit or add functionality */
  enableSourceCodeFilters: EnableSourceCodeFilters;

  exceptionFilter: SelectItem[];
  exceptionFilterMode: SelectItem[];
  //To enable or disable mode in dialog
  exceptionfiltermode: boolean;

  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;
    
  isExceptioFilterBrowse: boolean = false;
  isProfilePerm: boolean;

  constructor(private store: Store<KeywordList>, private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute, private configExceptionFilterService: ConfigExceptionFilterService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
  }
  subscription: Subscription;
  exceptionForm: boolean = true;

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    // if( this.data == false){
    //     this.isProfilePerm=true;
    // }
    this.loadExceptionFilterList();
    this.createExceptionTypeSelectType();
    if (this.configKeywordsService.keywordData != undefined) {
      this.keywordValue = this.configKeywordsService.keywordData;
    }
    else {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        this.keywordValue = keywordDataVal;
      });
    }
    this.exceptionfilter = {};
    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.exceptionfilter[key] = this.keywordValue[key];
        if (this.exceptionfilter[key].value == "true")
          this.selectedValues = true;
        else
          this.selectedValues = false;
      }
    });
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.uploadFile(data);
    });

  }


  saveKeywordData() {
   if(this.saveDisable == true)
   {
        return;
   }
    let filePath = '';
    for (let key in this.exceptionfilter) {
      if (key == 'enableSourceCodeFilters') {
        if (this.selectedValues == true) {
          this.exceptionfilter[key]["value"] = "true";
          this.configUtilityService.successMessage("Exception Filter settings are enabled");
        }
        else {
          this.exceptionfilter[key]["value"] = "false";
          this.configUtilityService.infoMessage("Exception Filter settings are disabled");
        }
      }
      this.configKeywordsService.keywordData[key] = this.exceptionfilter[key];
    }
    // this.configKeywordsService.saveProfileKeywords(this.profileId);
    this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
      if (this.selectedValues == false) {
        filePath = "NA";
      }
      else {
        filePath = data["_body"];
        filePath = filePath + "/enableSourceCodeFilters.ecf";
      }
      this.exceptionfilter['enableSourceCodeFilters'].path = filePath;
      this.keywordData.emit(this.exceptionfilter);
    });

  }



  // To load the data from databse to Advance Exception Filter table
  loadExceptionFilterList() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
       this.saveDisable =  true;
    });
    let that = this;
    this.configExceptionFilterService.getExceptionFilterData(this.profileId).subscribe(data => {
      data.map(function (val) {
        that.modifyData(val)
      })
      this.enableSourceCodeFiltersTableData = data;
    });
  }

  modifyData(val) {
    if (val.advanceExceptionFilterMode != null) {
      let mode: any;
      if (val.advanceExceptionFilterMode == 0) {
        mode = 'Disable';
      }
      else {
        mode = 'Enable'
      }
      val.advanceExceptionFilterMode = mode
    }
    if (val.advanceExceptionFilterOperation != null) {
      let pattern: any;
      if (val.advanceExceptionFilterOperation == '0') {
        pattern = 'default';
      }
      else if (val.advanceExceptionFilterOperation == '1') {
        pattern = 'StartsWith';
      }
      else if (val.advanceExceptionFilterOperation == '2') {
        pattern = 'EndsWith';
      }
      else
        pattern = 'Equal';

      val.advanceExceptionFilterOperation = pattern;
    }
  }




  //  To open the dialog for ADD functionality

  openAddExceptionFilterDialog() {
    this.enableSourceCodeFilters = new EnableSourceCodeFilters();
    this.isNewExceptionFilter = true;
    this.addEditExceptionFilterDialog = true;
  }

  //To show options for operation in dropdown of dialog

  createExceptionTypeSelectType() {
    this.exceptionFilter = [];
    this.exceptionFilter.push(
      { value: 'default', label: 'default' },
      { value: 'StartsWith', label: 'StartsWith' },
      { value: 'EndsWith', label: 'EndsWith' },
      { value: 'Equal', label: 'Equal' }, );
  }

  /**For showing edit dialog */
  openEditExceptionFilterrDialog(): void {
    if (!this.selectedExceptionFilterData || this.selectedExceptionFilterData.length < 1) {
      this.configUtilityService.errorMessage("Select a row to edit");
      return;
    }
    else if (this.selectedExceptionFilterData.length > 1) {
      this.configUtilityService.errorMessage("Select only one row to edit");
      return;
    }
    this.enableSourceCodeFilters = new EnableSourceCodeFilters();
    this.isNewExceptionFilter = false;
    this.addEditExceptionFilterDialog = true;
    if (String(this.selectedExceptionFilterData[0].advanceExceptionFilterMode) == "Enable")
      this.exceptionfiltermode = true;
    else
      this.exceptionfiltermode = false;
    if (this.selectedExceptionFilterData[0].advanceExceptionFilterOperation == "default")
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = 'default';
    else if (this.selectedExceptionFilterData[0].advanceExceptionFilterOperation == "StartsWith")
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = 'StartsWith';
    else if (this.selectedExceptionFilterData[0].advanceExceptionFilterOperation == "EndsWith")
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = 'EndsWith';
    else
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = 'EndsWith';



    this.enableSourceCodeFilters = Object.assign({}, this.selectedExceptionFilterData[0]);
  }

  //To save the filled values of dialog in backend

  saveExceptionFilter(): void {
    if (this.isNewExceptionFilter) {
      if (this.exceptionfiltermode == true)
        this.enableSourceCodeFilters.advanceExceptionFilterMode = 1;
      else
        this.enableSourceCodeFilters.advanceExceptionFilterMode = 0;
      if (this.enableSourceCodeFilters.advanceExceptionFilterOperation == 'default')
        this.enableSourceCodeFilters.advanceExceptionFilterOperation = '0';
      else if (this.enableSourceCodeFilters.advanceExceptionFilterOperation == 'StartsWith')
        this.enableSourceCodeFilters.advanceExceptionFilterOperation = '1';
      else if (this.enableSourceCodeFilters.advanceExceptionFilterOperation == 'EndsWith')
        this.enableSourceCodeFilters.advanceExceptionFilterOperation = '2';
      else
        this.enableSourceCodeFilters.advanceExceptionFilterOperation = '3';
      //this.enableSourceCodeFilters=new EnableSourceCodeFilters();
      if (!this.checkadvanceExceptionFilterPatternAlreadyExist()) {
        this.configExceptionFilterService.addExceptionFilterData(this.enableSourceCodeFilters, this.profileId)
          .subscribe(data => {
            this.modifyData(data);
            this.enableSourceCodeFiltersTableData = ImmutableArray.push(this.enableSourceCodeFiltersTableData, data);
            // this.enableSourceCodeFilter.push(data);
            this.configUtilityService.successMessage(Messages);
          });
        this.exceptionfiltermode = false;
        this.addEditExceptionFilterDialog = false;
      }
    }
    /**When add edit Exception Filter */
    else {
      if (this.selectedExceptionFilterData[0].advanceExceptionFilterPattern != this.enableSourceCodeFilters.advanceExceptionFilterPattern) {
        if (this.checkadvanceExceptionFilterPatternAlreadyExist())
          return;
      }
      this.editExceptionfilter();

    }
  }

  /**This method is used to validate the name of exceptionfilter pattern  already exists. */
  checkadvanceExceptionFilterPatternAlreadyExist(): boolean {
    for (let i = 0; i < this.enableSourceCodeFiltersTableData.length; i++) {
      if (this.enableSourceCodeFiltersTableData[i].advanceExceptionFilterPattern == this.enableSourceCodeFilters.advanceExceptionFilterPattern) {
        this.configUtilityService.errorMessage("Exception Filter Pattern already exist");
        return true;
      }
    }
  }
  editExceptionfilter() {
    if (this.exceptionfiltermode == true)
      this.enableSourceCodeFilters.advanceExceptionFilterMode = 1;
    else
      this.enableSourceCodeFilters.advanceExceptionFilterMode = 0;
    if (this.enableSourceCodeFilters.advanceExceptionFilterOperation == 'default')
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = '0';
    else if (this.enableSourceCodeFilters.advanceExceptionFilterOperation == 'StartsWith')
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = '1';
    else if (this.enableSourceCodeFilters.advanceExceptionFilterOperation == 'EndsWith')
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = '2';
    else
      this.enableSourceCodeFilters.advanceExceptionFilterOperation = '3';
    this.configExceptionFilterService.editExceptionFilterData(this.enableSourceCodeFilters, this.profileId)
      .subscribe(data => {
        this.modifyData(data);
        let index = this.getExceptionFilterIndex();
        this.selectedExceptionFilterData.length = 0;
        this.enableSourceCodeFiltersTableData = ImmutableArray.replace(this.enableSourceCodeFiltersTableData, data, index);
        this.configUtilityService.successMessage(Messages);
      });
    this.addEditExceptionFilterDialog = false;

  }
  getExceptionFilterIndex(): number {
    if (this.enableSourceCodeFilters) {
      let advanceExceptionFilterId = this.enableSourceCodeFilters.advanceExceptionFilterId;
      for (let i = 0; i < this.enableSourceCodeFiltersTableData.length; i++) {
        if (this.enableSourceCodeFiltersTableData[i].advanceExceptionFilterId == advanceExceptionFilterId) {
          return i;
        }
      }
    }
    return -1;

  }

  /**This method is used to delete Exception Filter */
  deleteExceptionFilter(): void {
    if (!this.selectedExceptionFilterData || this.selectedExceptionFilterData.length < 1) {
      this.configUtilityService.errorMessage("Select row(s) to delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedExceptionFilterData;
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].advanceExceptionFilterId);
        }
        this.configExceptionFilterService.deleteExceptionFilterData(arrAppIndex, this.profileId)
          .subscribe(data => {
            this.deleteExceptionFilterData(arrAppIndex);
            this.selectedExceptionFilterData = [];
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }


  /**This method is used to delete  from Data Table */
  deleteExceptionFilterData(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getExceptionFilter(arrIndex[index]));
    }
    this.enableSourceCodeFiltersTableData = deleteMany(this.enableSourceCodeFiltersTableData, rowIndex);
  }
  /**This method returns selected application row on the basis of selected row */
  getExceptionFilter(appId: any): number {
    for (let i = 0; i < this.enableSourceCodeFiltersTableData.length; i++) {
      if (this.enableSourceCodeFiltersTableData[i].advanceExceptionFilterId == appId) {
        return i;
      }
    }
    return -1;
  }
 /**used to open file manager
  */
  openFileManager() {
    
        this.openFileExplorerDialog = true;
        this.isExceptioFilterBrowse = true;
    
      }
  /** This method is called form ProductUI config-nd-file-explorer component with the path
 ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */

  /* dialog window & set relative path */
  uploadFile(filepath) {
    if (this.isExceptioFilterBrowse == true) {
      this.isExceptioFilterBrowse = false;
      this.openFileExplorerDialog = false;
      let  str : string;
      let str1:string;
      str=filepath.substring(filepath.lastIndexOf("/"),filepath.length)
      str1=str.substring(str.lastIndexOf("."),str.length);
      let check : boolean;
      if(str1 == ".ecf" || str1 == ".txt"){
         check=true;
      }
      else{
         check=false;
      }
      if(check==false){
        this.configUtilityService.errorMessage("Extension(s) other than .txt and .ecf are not supported");
        return;
      }
      
      if (filepath.includes(";")) {
        this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
        return;
      }
       let that=this;
      this.configExceptionFilterService.uploadExceptionFilterFile(filepath, this.profileId).subscribe(data => {
        data.map(function (val) {
          that.modifyData(val)
        })
        if (data.length == this.enableSourceCodeFiltersTableData.length) {
         this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data ");
         return;
        }
       // this.enableSourceCodeFiltersTableData = ImmutableArray.push(this.enableSourceCodeFiltersTableData, data);
        this.enableSourceCodeFiltersTableData = data;
        this.configUtilityService.successMessage("File uploaded successfully");
       });
    }
  }

}
