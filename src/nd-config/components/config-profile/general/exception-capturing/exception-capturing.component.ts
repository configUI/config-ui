import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ConfigExceptionFilterService } from '../../../../services/config-exceptionfilter.service';
import { EnableSourceCodeFilters } from '../../../../containers/exception-capture-data';
import { cloneObject } from '../../../../utils/config-utility';
import { ImmutableArray } from '../../../../utils/immutable-array';
import { ExceptionData } from '../../../../containers/exception-capture-data';

import { Messages  , addMessage , editMessage } from '../../../../constants/config-constant'

import { deleteMany } from '../../../../utils/config-utility';


@Component({
    selector: 'app-exception-capturing',
    templateUrl: './exception-capturing.component.html',
    styleUrls: ['./exception-capturing.component.css']
})
export class ExceptionCapturingComponent implements OnInit {

    @Input()
    saveDisable: boolean;
    profileId: number;
    index: number = 0;

    /**This is to send data to parent component(General Screen Component) for save keyword data */
    @Output()
    keywordData = new EventEmitter();
    exception: Object;

    /**These are those keyword which are used in current screen. */
    keywordList: string[] = ['instrExceptions', 'enableExceptionsWithSourceAndVars', 'enableSourceCodeFilters'];
    //exceptionfilter: Object;
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

    exceptionData: ExceptionData;
    agentType: string = "";

    constructor(private store: Store<KeywordList>, private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute, private configExceptionFilterService: ConfigExceptionFilterService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
        this.agentType = sessionStorage.getItem("agentType");
    }
    subscription: Subscription;
    exceptionForm: boolean = true;

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        if (this.saveDisable || this.isProfilePerm)
            this.configUtilityService.infoMessage("Reset and Save are disabled");

        this.route.params.subscribe((params: Params) => {
            this.profileId = params['profileId'];
            if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
                this.saveDisable = true;
            this.index = params['tabId'];
        });
        this.getKeywordData();
        this.loadExceptionFilterList();
        this.createExceptionTypeSelectType();
        this.configKeywordsService.fileListProvider.subscribe(data => {
            this.uploadFile(data);
        });

    }


    saveKeywordData(data) {
        let instrValue = this.instrExceptionValue(data);
        let filePath = '';
        for (let key in this.exception) {
            if (key == 'instrExceptions')
                this.exception[key]["value"] = instrValue;
            if (key == 'enableSourceCodeFilters') {
                if (this.selectedValues == true) {
                    this.exception[key]["value"] = "true";
                }
                else {
                    this.exception[key]["value"] = "false";
                }
            }
            this.configKeywordsService.keywordData[key] = this.exception[key];
        }

        this.configExceptionFilterService.writeExceptionFilterFile(this.profileId).subscribe(data => {
            console.log("data", data)
        });

        this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
            if (this.selectedValues == false) {
                filePath = "NA";
            }
            else {
                filePath = data["_body"];
                filePath = filePath + "/enableSourceCodeFilters.ecf";
            }
            this.exception['enableSourceCodeFilters'].path = filePath;
            this.keywordData.emit(this.exception);
        });
    }

    /* This method is used to reset the keyword data */
    resetKeywordData() {
        let data = this.configKeywordsService.keywordData
        for (let key in data) {
            if (this.keywordList.includes(key)) {
              this.exception[key].value = data[key].value;
            }
          }
          this.methodToSetValue(this.exception);
    }
    /* This method is used to reset the keyword data to its Default value */
    resetKeywordsDataToDefault() {
        let data = this.configKeywordsService.keywordData
        for (let key in data) {
            if (this.keywordList.includes(key)) {
              this.exception[key].value = data[key].defaultValue;
            }
          }
        this.methodToSetValue(this.exception);
    }

    //This method is used to set value of data depending on data received in its argument
    methodToSetValue(data){
        this.exception = data;
        for (let key in this.exception) {
            if (key == 'enableSourceCodeFilters') {
                if (this.exception[key]["value"] == "true" || this.exception[key]["value"] == true) {
                    this.selectedValues = true;
                }
                else {
                    this.selectedValues = false;
                }
            }
        }
        if ((this.exception["instrExceptions"].value).includes("%20")) {
            let arr = (this.exception["instrExceptions"].value).split("%20")
            this.exceptionData = new ExceptionData();
            if (arr[0] === "1" && arr[2] === "0") {
                this.exceptionData.instrumentException = true;
                this.exceptionData.exceptionCapturing = false;
                this.exceptionData.exceptionType = false;
            }
            else if (arr[0] === "1" && arr[2] === "3") {
                this.exceptionData.instrumentException = true;
                this.exceptionData.exceptionCapturing = false;
                this.exceptionData.exceptionType = true;
            }
            else if (arr[0] === "2" && arr[2] === "0") {
                this.exceptionData.instrumentException = true;
                this.exceptionData.exceptionCapturing = true;
                this.exceptionData.exceptionType = false;
            }
            else if (arr[0] === "2" && arr[2] === "3") {
                this.exceptionData.instrumentException = true;
                this.exceptionData.exceptionCapturing = true;
                this.exceptionData.exceptionType = true;
            }
            else
                this.exceptionData.instrumentException = false;

            if (arr.length > 3)
                this.exceptionData.exceptionTraceDepth = arr[3];
            else
                this.exceptionData.exceptionTraceDepth = 20;
        }
        else if (this.exception["instrExceptions"].value == 0 || this.exception["instrExceptions"].value == "0") {
            this.exceptionData = new ExceptionData();
            this.exceptionData.instrumentException = false;
            this.exceptionData.exceptionCapturing = false;
            this.exceptionData.exceptionTrace = false;
            this.exceptionData.exceptionType = false;
            this.exceptionData.exceptionTraceDepth = 20;
        }
        else {
            this.exceptionData = new ExceptionData();
            this.exceptionData.instrumentException = true;
            this.exceptionData.exceptionCapturing = false;
            this.exceptionData.exceptionTrace = false;
            this.exceptionData.exceptionType = false;
            this.exceptionData.exceptionTraceDepth = 20;
        }
    }
    /* This method is used to get the existing keyword data from the backend */
    getKeywordData() {
        // let keywordData = this.configKeywordsService.keywordData;
        this.subscription = this.store.select("keywordData").subscribe(data => {
            var keywordDataVal = {}
            this.keywordList.map(function (key) {
                keywordDataVal[key] = data[key];
            })
            this.exception = keywordDataVal;
            this.methodToSetValue(this.exception );
        });
    }

    /**Value for this keyword is
     * 1%201%200%2012
     * 1-  Enable instrumentException // It can be 1 or 2 [1- complete exceotion 2-L1 fp capturing]
     * 1- enable exceptionTrace
     * 0- false 3- true //for capture Exception type
     * 12- Trace limit for frames //dependent on 2nd value
     */

    // Method used to construct the value of instrException keyword.
    instrExceptionValue(data) {
        var instrVal = {};
        if (data.form._value.instrumentException === "false" || data.form._value.instrumentException === false) {
            instrVal = "0";
        }
        else {
            if (this.exceptionData.exceptionCapturing == false)
                instrVal = "1";

            if (this.exceptionData.exceptionCapturing == true)
                instrVal = "2";

            if (data.form._value.exceptionTraceDepth != null || data.form._value.exceptionTraceDepth != undefined)
                instrVal = instrVal + "%201";
            else
                instrVal = instrVal + "%200";

            if (this.exceptionData.exceptionType == false)
                instrVal = instrVal + "%200";
            else
                instrVal = instrVal + "%203"

            // if (data.form._value.exceptionTrace === "true" || data.form._value.exceptionTrace === true)
            instrVal = instrVal + "%20" + data.form._value.exceptionTraceDepth;
        }
        return instrVal;
    }



    // To load the data from databse to Advance Exception Filter table
    loadExceptionFilterList() {

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
                        this.configUtilityService.successMessage(addMessage);
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
                this.configUtilityService.successMessage(editMessage);
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
            let str: string;
            let str1: string;
            str = filepath.substring(filepath.lastIndexOf("/"), filepath.length)
            str1 = str.substring(str.lastIndexOf("."), str.length);
            let check: boolean;
            if (str1 == ".ecf" || str1 == ".txt") {
                check = true;
            }
            else {
                check = false;
            }
            if (check == false) {
                this.configUtilityService.errorMessage("File Extension(s) other than .txt and .ecf are not supported");
                return;
            }

            if (filepath.includes(";")) {
                this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
                return;
            }
            let that = this;
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
  // for download Excel, word, Pdf File 
  downloadReports(reports: string) {
    let arrHeader = { "0": "Pattern", "1": "Mode", "2": "Operation"};
    let arrcolSize = { "0": 3, "1": 3, "2": 3 };
    let arrAlignmentOfColumn = { "0": "left", "1": "left", "2": "left"};
    let arrFieldName = { "0": "advanceExceptionFilterPattern", "1": "advanceExceptionFilterMode", "2": "advanceExceptionFilterOperation"};
    let object =
      {
        data: this.enableSourceCodeFiltersTableData,
        headerList: arrHeader,
        colSize: arrcolSize,
        alignArr: arrAlignmentOfColumn,
        fieldName: arrFieldName,
        downloadType: reports,
        title: "Exception Filter",
        fileName: "exceptionfilter",
      }
    this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
      this.openDownloadReports(data._body)
    })
  }

  /* for open download reports*/
  openDownloadReports(res) {
    window.open("/common/" + res);
  }
 /**
  * Purpose : To invoke the service responsible to open Help Notification Dialog 
  * related to the current component.
  */
  sendHelpNotification() {
     this.configKeywordsService.getHelpContent("General", "Exception Capturing", this.agentType);
  }

    ngOnDestroy() {
     this.isExceptioFilterBrowse = false;
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}
