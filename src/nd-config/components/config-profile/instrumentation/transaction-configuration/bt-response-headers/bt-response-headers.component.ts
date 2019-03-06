import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { BTResponseHeaderData, BTResponseHeaderConditions } from '../../../../../containers/instrumentation-data'
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { ConfigUiUtility } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';
import { deleteMany } from '../../../../../utils/config-utility';

import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { Messages , addMessage , editMessage } from '../../../../../constants/config-constant';

@Component({
    selector: 'bt-response-headers',
    templateUrl: './bt-response-headers.component.html',
    styleUrls: ['./bt-response-headers.component.css']
})
export class BTResponseHeadersComponent implements OnInit {

    /**This is to send data to parent component(General Screen Component) for save keyword data */
    @Output()
    keywordData = new EventEmitter();

    profileId: number;

    /**Assign data to BT Response Headers table */
    btResponseHeadersInfo: BTResponseHeaderData[];
    btResponseHeadersDetail: BTResponseHeaderData;
    selectedResponseHeaders: BTResponseHeaderData[];

    /** Assign data to BT Response header conditions */
    resHeaderConditionInfo: BTResponseHeaderConditions[];
    resHeaderConditionDetail: BTResponseHeaderConditions;
    selectedResponseHeader: BTResponseHeaderConditions[];

    //For initializing drop down data
    responseHeader: SelectItem[];
    resHeaderType: SelectItem[];
    resOperationName: SelectItem[];

    addResReqHeaderDialog: boolean = false;
    addResDialog: boolean = false;

    editResConditions: boolean = false;

    //For checking if it is new row or existing
    isNewResHeader: boolean = false;
    isNewResCond: boolean = false;

    responseHdrDelete = [];

    //Counter for adding/editing conditions
    resCondCount: number = 0;
    resCondCountEdit: number = 0;

    saveDisable: boolean = false;
    isProfilePerm: boolean;

    constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService) {
    }
    ngOnInit() {
        this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.route.params.subscribe((params: Params) => {
            this.profileId = params['profileId'];
            if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
                this.saveDisable =  true;
        });

        //Response to get all BT Response headers data
        this.configKeywordsService.getBTResponseHdrData(this.profileId).subscribe(data => {
            this.btResponseHeadersInfo = data;
            this.modifyData(data);
        });

        this.btResponseHeadersDetail = new BTResponseHeaderData();
        this.resHeaderConditionDetail = new BTResponseHeaderConditions();

    }

    //opens add Response conditions dialog
    openResDialog() {
        this.addResDialog = true;
        this.isNewResCond = true;
        this.resHeaderConditionDetail = new BTResponseHeaderConditions();
        this.loadOperationName();
    }

    //Opens Add BT Response header dialog
    openHeader() {
        this.btResponseHeadersDetail = new BTResponseHeaderData();
        this.resHeaderConditionDetail = new BTResponseHeaderConditions();
        this.isNewResHeader = true;
        this.addResReqHeaderDialog = true;
        this.resHeaderConditionInfo = [];
        if (this.btResponseHeadersInfo == undefined)
            this.btResponseHeadersInfo = [];
        this.loadOperationName();
    }

    //To load opeartion resOperationName
    loadOperationName() {
        this.resOperationName = [];
        var opName = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];
        var opVal = ['EQUALS', 'OCCURS', 'VALUE', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH'];

        this.resOperationName = ConfigUiUtility.createListWithKeyValue(opName, opVal);
    }

    //Method to add and edit BT Response headers data
    saveAddEditResponseheaders() {
        //When add new Response Headers
        if (this.isNewResHeader) {

            this.saveResponseHeaders();
        }

        //When add edit Response Headers
        else {
            this.editResponseHeader();
        }
    }

    //Method to save new Response Headers
    saveResponseHeaders() {
        this.btResponseHeadersDetail.conditions = [];

        this.btResponseHeadersDetail.conditions = this.resHeaderConditionInfo;
        if (this.resHeaderConditionInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
            return;
        }
        this.configKeywordsService.addBtResponseHeaders(this.btResponseHeadersDetail, this.profileId).subscribe(data => {
            this.btResponseHeadersInfo = ImmutableArray.push(this.btResponseHeadersInfo, data);
            this.configUtilityService.successMessage(addMessage);
            this.modifyData(this.btResponseHeadersInfo);

        });
        this.addResReqHeaderDialog = false;
    }

    //Method to edit Response Headers
    editResponseHeader() {
        if (this.resHeaderConditionInfo.length == 0) {
            this.configUtilityService.errorMessage("Provide header conditions for selected Header name");
            return;
        }
        this.btResponseHeadersDetail.conditions = this.resHeaderConditionInfo;
        this.btResponseHeadersDetail.headerId = this.selectedResponseHeaders[0].headerId;
        /****for edit case
      *  first triggering the response to delete the  conditions and
      *  when response comes then triggering response to add the new Response Headers
      *
      */
        this.selectedResponseHeaders = [];
        this.configKeywordsService.deleteResponseHdrConditions(this.responseHdrDelete).subscribe(data => {
            let that = this;
            //Edit call, sending row data to service
            this.configKeywordsService.editBTResponseHeaders(this.btResponseHeadersDetail).subscribe(data => {

                this.btResponseHeadersInfo.map(function (val) {
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
                this.configUtilityService.successMessage(editMessage);
            });
        })
        this.closeDialog3();
    }

    //Opens edit Response Headers dialog
    openEditResponseHeader() {
        this.selectedResponseHeader = [];
        this.btResponseHeadersDetail = new BTResponseHeaderData();
        if (!this.selectedResponseHeaders || this.selectedResponseHeaders.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedResponseHeaders.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        else {
            this.isNewResHeader = false;
            this.addResReqHeaderDialog = true;
            // this.editResConditions = true;
            this.isNewResCond = true;
            let that = this;
            this.responseHdrDelete = [];
            this.btResponseHeadersDetail = Object.assign({}, this.selectedResponseHeaders[0]);
            this.loadOperationName();
            this.resHeaderConditionInfo = this.selectedResponseHeaders[0].conditions;
            //providing Id for editing conditions in edit header form
            this.resHeaderConditionInfo.map(function (val) {
                val.id = that.resCondCountEdit;
                that.resCondCountEdit = that.resCondCountEdit + 1;
            })
        }

    }

    //Method to show bt names seperated by commas in BT Response headers table
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
        this.btResponseHeadersInfo = data
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

    //Method to add BT Response response conditions
    saveConditions() {
        if (this.resHeaderConditionDetail.operation == "VALUE") {
            this.resHeaderConditionDetail.btName = "-";
            this.resHeaderConditionDetail.hdrValue = "-";
        }
        if (this.resHeaderConditionDetail.operation == "OCCURS") {
            this.resHeaderConditionDetail.hdrValue = "-";
        }
        //EDIT functionality
        if (!this.isNewResHeader) {
            if (this.editResConditions) {
                //In edit form to edit conditions
                this.isNewResCond = false;
                this.editResConditions = false;
                let that = this;
                this.resHeaderConditionInfo.map(function (val) {
                    if (val.id == that.resHeaderConditionDetail.id) {
                        val.btName = that.resHeaderConditionDetail.btName;
                        val.hdrValue = that.resHeaderConditionDetail.hdrValue;
                        val.operation = that.resHeaderConditionDetail.operation;
                    }
                });
                this.selectedResponseHeader = [];
            }

            else {
                //In edit form to add conditions
                this.isNewResCond = true;
                this.resHeaderConditionDetail["id"] = this.resCondCountEdit;
                this.resHeaderConditionInfo = ImmutableArray.push(this.resHeaderConditionInfo, this.resHeaderConditionDetail);
                this.resCondCountEdit = this.resCondCountEdit + 1;
            }
        }

        //ADD functionality
        else {
            //In add form, to edit conditions
            if (this.editResConditions) {
                this.isNewResCond = false;
                this.editResConditions = false;
                let that = this;
                this.resHeaderConditionInfo.map(function (val) {
                    if (val.id == that.resHeaderConditionDetail.id) {
                        val.btName = that.resHeaderConditionDetail.btName;
                        val.hdrValue = that.resHeaderConditionDetail.hdrValue;
                        val.operation = that.resHeaderConditionDetail.operation;
                    }
                });
                this.selectedResponseHeader = [];
            }

            else {
                //In add form to add conditions

                this.isNewResCond = true;
                this.resHeaderConditionDetail["id"] = this.resCondCount;
                this.resHeaderConditionInfo = ImmutableArray.push(this.resHeaderConditionInfo, this.resHeaderConditionDetail);
                this.resCondCount = this.resCondCount + 1;
            }
        }
        this.addResDialog = false;
        this.resHeaderConditionDetail = new BTResponseHeaderConditions();
    }

    //Method to delete response headers
    deleteResHdr() {
        if (!this.selectedResponseHeader || this.selectedResponseHeader.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        let selectResHdrs = this.selectedResponseHeader;
        let arrResIndex = [];
        for (let index in selectResHdrs) {
            arrResIndex.push(selectResHdrs[index]);
            if (selectResHdrs[index].hasOwnProperty('hdrCondId')) {
                this.responseHdrDelete.push(selectResHdrs[index].hdrCondId);
            }
        }
        this.deleteConditionFromTable(arrResIndex);
        this.selectedResponseHeader = [];
    }

    /**This method is used to delete BT Response Headers*/
    deleteBTResponseHeaders(): void {
        if (!this.selectedResponseHeaders || this.selectedResponseHeaders.length < 1) {
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;
        }
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                //Get Selected headers's headerId
                let selectedApp = this.selectedResponseHeaders;
                let arrAppIndex = [];
                for (let index in selectedApp) {
                    arrAppIndex.push(selectedApp[index].headerId);
                }
                this.configKeywordsService.deleteBTResponseHeaders(arrAppIndex, this.profileId)
                    .subscribe(data => {
                        this.deleteBtResponseHeaders(arrAppIndex);
                        this.selectedResponseHeaders = [];
                        this.configUtilityService.infoMessage("Deleted Successfully");
                    })
            },
            reject: () => {
            }
        });
    }

    /**This method is used to delete headers from Data Table */
    deleteBtResponseHeaders(arrIndex) {
        let rowIndex: number[] = [];

        for (let index in arrIndex) {
            rowIndex.push(this.getHeadersIndex(arrIndex[index]));
        }
        this.btResponseHeadersInfo = deleteMany(this.btResponseHeadersInfo, rowIndex);
    }

    /**This method returns selected headers row on the basis of selected row */
    getHeadersIndex(appId: any): number {
        for (let i = 0; i < this.btResponseHeadersInfo.length; i++) {
            if (this.btResponseHeadersInfo[i].headerId == appId) {
                return i;
            }
        }
        return -1;
    }

    /**This method is used to delete conditions from Data Table */
    deleteConditionFromTable(arrResIndex: any[]): void {
        //For stores table row index
        let rowIndex: number[] = [];

       if(arrResIndex.length < 1){
            this.configUtilityService.errorMessage("Select row(s) to delete");
            return;    
        }
       for (let index in arrResIndex) {
            rowIndex.push(this.getCondIndex(arrResIndex[index]));
        }
        this.resHeaderConditionInfo = deleteMany(this.resHeaderConditionInfo, rowIndex);
    }

    /**This method returns selected condition row on the basis of selected row */
    getCondIndex(appId: any): number {
        for (let i = 0; i < this.resHeaderConditionInfo.length; i++) {
            if (this.resHeaderConditionInfo[i] == appId) {
                return i;
            }
        }
        return -1;
    }

    //Opens Edit conditions window
    openEditResDialog() {
        if (!this.selectedResponseHeader || this.selectedResponseHeader.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
        }
        else if (this.selectedResponseHeader.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit")
        }
        else {
            this.isNewResCond = false;
            this.editResConditions = true;
            // On opening edit conditions dialog, replacing '-' with ''
            if (this.selectedResponseHeader[0].operation == "VALUE") {
                this.selectedResponseHeader[0].btName = "";
                this.selectedResponseHeader[0].hdrValue = "";
            }
            else if (this.selectedResponseHeader[0].operation == "OCCURS") {
                this.selectedResponseHeader[0].hdrValue = "";
            }
            this.resHeaderConditionDetail = Object.assign({}, this.selectedResponseHeader[0]);
        }

    }

    //Closing conditions dialog
    closeResponseDialog() {
        this.addResDialog = false;
    }

    //Closing BT Response Headers dialog
    closeDialog3() {
        this.addResReqHeaderDialog = false;
    }
}

