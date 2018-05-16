import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BTHTTPHeaderData, BTHTTPHeaderConditions } from '../../../../../containers/instrumentation-data'
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { deleteMany } from '../../../../../utils/config-utility';

import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { Messages } from '../../../../../constants/config-constant';

@Component({
    selector: 'bt-http-headers',
    templateUrl: './bt-http-headers.component.html',
    styleUrls: ['./bt-http-headers.component.css']
})
export class BTHTTPHeadersComponent implements OnInit {

    /**This is to send data to parent component(General Screen Component) for save keyword data */
    @Output()
    keywordData = new EventEmitter();

    profileId: number;

    /**Assign data to BT HTTP Headers table */
    btHttpHeadersInfo: BTHTTPHeaderData[];
    btHttpHeadersDetail: BTHTTPHeaderData;
    selectedHTTPHeaders: BTHTTPHeaderData[];

    /** Assign data to BT HTTP Request header conditions */
    headerConditionInfo: BTHTTPHeaderConditions[];
    headerConditionDetail: BTHTTPHeaderConditions;
    selectedRequestHeader: BTHTTPHeaderConditions[];

    //For initializing drop down data
    requestHeader: SelectItem[];
    responseHeader: SelectItem[];
    headerType: SelectItem[];
    operationName: SelectItem[];

    addResReqHeaderDialog: boolean = false;
    addReqDialog: boolean = false;

    enableRequest: boolean;

    editConditions: boolean = false;
    editHeaders: boolean = false;

    //For checking if it is new row or existing
    isNewHeader: boolean = false;
    isNewCond: boolean = false;

    httpHdrDelete = [];

    //Counter for adding/editing conditions
    condCount: number = 0;
    condCountEdit: number = 0;

    saveDisable: boolean = false;
    isProfilePerm: boolean;

    /** To open file explorer dialog */
    openFileExplorerDialog: boolean = false;
    isbTHTTPHdrBrowse :boolean;

    constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
    }
    ngOnInit() {
        this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.route.params.subscribe((params: Params) => {
            this.profileId = params['profileId'];
            if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
                this.saveDisable =  true;
        });
        this.configKeywordsService.fileListProvider.subscribe(data => {
            this.uploadFile(data);
          });
        //Request to get all BT HTTP headers data
        this.configKeywordsService.getBTHttpHdrData(this.profileId).subscribe(data => {
            this.btHttpHeadersInfo = data;
            this.modifyData(data);
        });

        this.btHttpHeadersDetail = new BTHTTPHeaderData();
        this.headerConditionDetail = new BTHTTPHeaderConditions();
    }

    //opens add request conditions dialog
    openReqDialog() {
        this.addReqDialog = true;
        this.isNewCond = true;
        this.headerConditionDetail = new BTHTTPHeaderConditions();
        this.loadOperationName();
    }

    //Opens Add BT HTTP header dialog
    openHeader() {
        this.btHttpHeadersDetail = new BTHTTPHeaderData();
        this.headerConditionDetail = new BTHTTPHeaderConditions();
        this.isNewHeader = true;
        this.addResReqHeaderDialog = true;
        this.headerConditionInfo = [];
        if (this.btHttpHeadersInfo == undefined)
            this.btHttpHeadersInfo = [];
    }

    //This method loads Header request drop-down values
    // loadResponseHeader() {
    //     this.responseHeader = [];
    //     var resHdrLabel = ['--Select--', 'Accept-Charset', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'Accept', 'Authorization',
    //         'Cache-Control', 'Connection', 'Content-Length', 'Content-MD5', 'Content-Type', 'Cookie', 'DNT', 'Date', 'Expect',
    //         'Front-End-Https', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since',
    //         'Max-Forwards', 'Origin', 'Pragma', 'Proxy-Authorization', 'If-Range', 'Proxy-Connection', 'Range', 'Referer',
    //         'TE', 'Upgrade', 'User-Agent', 'Via', 'Warning', 'X-ATT-DeviceId', 'X-Forwarded-For', 'X-Forwarded-Proto',
    //         'X-Requested-With', 'X-Wap-Profile'];

    //     var resHdrVal = ['0', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58',
    //         '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83'];

    //     this.responseHeader = ConfigUiUtility.createListWithKeyValue(resHdrLabel, resHdrVal);
    // }

    //To load opeartion operationName
    loadOperationName() {
        this.operationName = [];
        var opName = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];
        var opVal = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];

        this.operationName = ConfigUiUtility.createListWithKeyValue(opName, opVal);
    }

    //Method to add and edit BT HTTP headers data
    saveAddEditHttpheaders() {
        //When add new HTTP Headers
        if (this.isNewHeader) {

            this.saveHttpHeaders();
        }

        //When add edit HTTP Headers
        else {
            this.editHttpHeader();
        }
    }

    //Method to save new HTTP Headers
    saveHttpHeaders() {
        this.btHttpHeadersDetail.conditions = [];

        this.btHttpHeadersDetail.conditions = this.headerConditionInfo;
        if (this.headerConditionInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
            return;
        }
        this.configKeywordsService.addBtHttpHeaders(this.btHttpHeadersDetail, this.profileId).subscribe(data => {
            this.btHttpHeadersInfo = ImmutableArray.push(this.btHttpHeadersInfo, data);
            this.configUtilityService.successMessage(Messages);
            this.modifyData(this.btHttpHeadersInfo);

        });
        this.addResReqHeaderDialog = false;
    }

    //Method to edit HTTP Headers
    editHttpHeader() {
        if (this.headerConditionInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
            return;
        }
        this.btHttpHeadersDetail.conditions = this.headerConditionInfo;
        this.btHttpHeadersDetail.headerId = this.selectedHTTPHeaders[0].headerId;
        /****for edit case
      *  first triggering the request to delete the  conditions and
      *  when response comes then triggering request to add the new HTTP Headers
      *
      */
        this.selectedHTTPHeaders = [];
        this.configKeywordsService.deleteHTTPHdrConditions(this.httpHdrDelete).subscribe(data => {
            let that = this;
            //Edit call, sending row data to service
            this.configKeywordsService.editBTHTTPHeaders(this.btHttpHeadersDetail).subscribe(data => {

                this.btHttpHeadersInfo.map(function (val) {
                    if (val.headerId == data.headerId) {
                        val.conditions = data.conditions;
                        val.hdrBtNames = data.hdrBtNames;
                        val.headerName = data.headerName;
                        val.headerValType = data.headerValType;
                        val.id = data.id;
                    }
                    // that.modifyData(val);
                    if (val.conditions != null && val.conditions.length != 0) {
                        let btNames = that.getBtNames(val.conditions);
                        val.hdrBtNames = btNames
                    }
                    else {
                        val.hdrBtNames = "NA"
                    }

                });
                this.configUtilityService.successMessage(Messages);
            });
        })
        this.closeDialog();
    }

    //Opens edit HTTP Headers dialog
    openEditHttpHeader() {
         this.selectedRequestHeader = [];
        this.btHttpHeadersDetail = new BTHTTPHeaderData();
        if (!this.selectedHTTPHeaders || this.selectedHTTPHeaders.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedHTTPHeaders.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        else {
            this.isNewHeader = false;
            this.addResReqHeaderDialog = true;
            // this.editConditions = true;
            this.isNewCond = true;
            let that = this;
            this.httpHdrDelete = [];
            this.btHttpHeadersDetail = Object.assign({}, this.selectedHTTPHeaders[0]);
            this.loadOperationName();
            this.headerConditionInfo = this.selectedHTTPHeaders[0].conditions;
            //providing Id for editing conditions in edit header form
            this.headerConditionInfo.map(function (val) {
                val.id = that.condCountEdit;
                that.condCountEdit = that.condCountEdit + 1;
            })
        }

    }

    //Method to show bt names seperated by commas in BT HTTP headers table
    modifyData(data) {
        let that = this;
        data.map(function (val) {
            if (val.conditions != null && val.conditions.length != 0) {
                let btNames = that.getBtNames(val.conditions);
                val.hdrBtNames = btNames
            }
            else {
                val.hdrBtNames = "NA"
            }
        })
        this.btHttpHeadersInfo = data
    }


    getBtNames(data) {
        let btNamesHref = '';
        data.map(function (val, index) {
            if (index != (data.length - 1)) {
                if (val.btName == null) {
                    btNamesHref = btNamesHref + " - " + ",";
                }
                else
                    btNamesHref = btNamesHref + val.btName + ",";
            }
            else {
                if (val.btName == null) {
                    btNamesHref = btNamesHref + " - "
                }
                else
                    btNamesHref = btNamesHref + val.btName
            }
        })
        return btNamesHref;
    }

    //Method to add BT http request conditions
    saveConditions() {
        if (this.headerConditionDetail.operation == "VALUE") {
            this.headerConditionDetail.btName = "-";
            this.headerConditionDetail.hdrValue = "-";
        }
        if (this.headerConditionDetail.operation == "OCCURS") {
            this.headerConditionDetail.hdrValue = "-";
        }
        //EDIT functionality
        if (!this.isNewHeader) {
            if (this.editConditions) {
                //In edit form to edit conditions
                this.isNewCond = false;
                this.editConditions = false;
                let that = this;
                this.headerConditionInfo.map(function (val) {
                    if (val.id == that.headerConditionDetail.id) {
                        val.btName = that.headerConditionDetail.btName;
                        val.hdrValue = that.headerConditionDetail.hdrValue;
                        val.operation = that.headerConditionDetail.operation;
                    }
                });
                this.selectedRequestHeader = [];
            }

            else {
                //In edit form to add conditions
                this.isNewCond = true;
                this.headerConditionDetail["id"] = this.condCountEdit;
                this.headerConditionInfo = ImmutableArray.push(this.headerConditionInfo, this.headerConditionDetail);
                this.condCountEdit = this.condCountEdit + 1;
            }
        }

        //ADD functionality
        else {
            //In add form, to edit conditions
            if (this.editConditions) {
                this.isNewCond = false;
                this.editConditions = false;
                let that = this;
                this.headerConditionInfo.map(function (val) {
                    if (val.id == that.headerConditionDetail.id) {
                        val.btName = that.headerConditionDetail.btName;
                        val.hdrValue = that.headerConditionDetail.hdrValue;
                        val.operation = that.headerConditionDetail.operation;
                    }
                });
                this.selectedRequestHeader = [];
            }

            else {
                //In add form to add conditions

                this.isNewCond = true;
                this.headerConditionDetail["id"] = this.condCount;
                this.headerConditionInfo = ImmutableArray.push(this.headerConditionInfo, this.headerConditionDetail);
                this.condCount = this.condCount + 1;
            }
        }
        this.addReqDialog = false;
    }

    //Method to delete request headers
    deleteReqHdr() {
        if (!this.selectedRequestHeader || this.selectedRequestHeader.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        let selectReqHdrs = this.selectedRequestHeader;
        let arrReqIndex = [];
        for (let index in selectReqHdrs) {
            arrReqIndex.push(selectReqHdrs[index]);
            if (selectReqHdrs[index].hasOwnProperty('hdrCondId')) {
                this.httpHdrDelete.push(selectReqHdrs[index].hdrCondId);
            }
        }
        this.deleteConditionFromTable(arrReqIndex);
        this.selectedRequestHeader = [];
    }

    /**This method is used to delete BT HTTP Headers*/
    deleteBTHTTPHeaders(): void {
        if (!this.selectedHTTPHeaders || this.selectedHTTPHeaders.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected headers's headerId
                let selectedApp = this.selectedHTTPHeaders;
                let arrAppIndex = [];
                for (let index in selectedApp) {
                    arrAppIndex.push(selectedApp[index].headerId);
                }
                this.configKeywordsService.deleteBTHTTPHeaders(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteBtHttpHeaders(arrAppIndex);
                        this.selectedHTTPHeaders = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete headers from Data Table */
    deleteBtHttpHeaders(arrIndex) {
        let rowIndex: number[] = [];

        for (let index in arrIndex) {
            rowIndex.push(this.getHeadersIndex(arrIndex[index]));
        }
        this.btHttpHeadersInfo = deleteMany(this.btHttpHeadersInfo, rowIndex);
    }

    /**This method returns selected headers row on the basis of selected row */
    getHeadersIndex(appId: any): number {
        for (let i = 0; i < this.btHttpHeadersInfo.length; i++) {
            if (this.btHttpHeadersInfo[i].headerId == appId) {
                return i;
            }
        }
        return -1;
    }

    /**This method is used to delete conditions from Data Table */
    deleteConditionFromTable(arrReqIndex: any[]): void {
        //For stores table row index
        let rowIndex: number[] = [];

       if(arrReqIndex.length < 1){
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;    
        }
       for (let index in arrReqIndex) {
            rowIndex.push(this.getCondIndex(arrReqIndex[index]));
        }
        this.headerConditionInfo = deleteMany(this.headerConditionInfo, rowIndex);
    }

    /**This method returns selected condition row on the basis of selected row */
    getCondIndex(appId: any): number {
        for (let i = 0; i < this.headerConditionInfo.length; i++) {
            if (this.headerConditionInfo[i] == appId) {
                return i;
            }
        }
        return -1;
    }

    //Opens Edit conditions window
    openEditReqDialog() {
        if (!this.selectedRequestHeader || this.selectedRequestHeader.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
        }
        else if (this.selectedRequestHeader.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit")
        }
        else {
            this.isNewCond = false;
            this.editConditions = true;
            this.addReqDialog = true;
            // On opening edit conditions dialog, replacing '-' with ''
            if (this.selectedRequestHeader[0].operation == "VALUE") {
                this.selectedRequestHeader[0].btName = "";
                this.selectedRequestHeader[0].hdrValue = "";
            }
            else if (this.selectedRequestHeader[0].operation == "OCCURS") {
                this.selectedRequestHeader[0].hdrValue = "";
            }
            this.headerConditionDetail = Object.assign({}, this.selectedRequestHeader[0]);
        }

    }

    //Closing conditions dialog
    closeResponseDialog() {
        this.addReqDialog = false;
    }

    //Closing BT HTTP Headers dialog
    closeDialog() {
        this.addResReqHeaderDialog = false;
    }





    openFileManager(){
        this.openFileExplorerDialog = true;
        this.isbTHTTPHdrBrowse = true;
      }
    
      /** This method is called form ProductUI config-nd-file-explorer component with the path
     ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */
    
      /* dialog window & set relative path */
      uploadFile(filepath) {
        if (this.isbTHTTPHdrBrowse == true) {
          this.isbTHTTPHdrBrowse = false;
          this.openFileExplorerDialog = false;
        let fileNameWithExt: string;
        let fileExt: string;
        fileNameWithExt = filepath.substring(filepath.lastIndexOf("/"), filepath.length)
        fileExt = fileNameWithExt.substring(fileNameWithExt.lastIndexOf("."), fileNameWithExt.length);
        let check: boolean;
        if (fileExt == ".btr" || fileExt == ".txt") {
            check = true;
        }
        else {
            check = false;
        }
        if (check == false) {
            this.configUtilityService.errorMessage("File Extension(s) other than .txt and .btr are not supported");
            return;
        }
    
        if (filepath.includes(";")) {
            this.configUtilityService.errorMessage("Multiple files cannot be imported at the same time");
            return;
        }
          this.configKeywordsService.uploadBTHTTPHdrFile(filepath, this.profileId).subscribe(data => {
              if(data.length == this.btHttpHeadersInfo.length){
                this.configUtilityService.errorMessage("Could not upload. This file may already be imported or contains invalid data");
              }
              this.btHttpHeadersInfo = data;
              this.modifyData(data);
           });
        }
    }
}

