import { Component, OnInit } from '@angular/core';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { ConfigKeywordsService } from '../../../../../../services/config-keywords.service';
import { HTTPRequestHdrComponentData,RulesHTTPRequestHdrComponentData } from '../../../../../../containers/instrumentation-data';
import { httpReqHeaderInfo } from '../../../../../../interfaces/httpReqHeaderInfo';
import { ConfigUtilityService } from '../../../../../../services/config-utility.service';
import { SelectItem,ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';
import { deleteMany } from '../../../../../../utils/config-utility';

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
  styleUrls: ['./http-request.component.css']
})
export class HttpRequestComponent implements OnInit {

  httpRequestHdrComponentInfo: httpReqHeaderInfo[];

  /* Add and Edit HTTP Request Dialog open */
  httpRequestCustomDialog: boolean = false;

  /* Add and edit http request custom settings dialog */
  rulesDialog: boolean = false;

  isNew: boolean = false;

  profileId: number;

  httpRequestHdrDetail: HTTPRequestHdrComponentData;
  httpRequestHdrInfo: HTTPRequestHdrComponentData[];
  selectedHTTPReqHeader : any;

  rulesData: RulesHTTPRequestHdrComponentData;
  rulesDataInfo: RulesHTTPRequestHdrComponentData[];
  selectedRulesData : any[];

  customValueType: SelectItem[];
  
  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService,private confirmationService: ConfirmationService) {
    this.customValueType = [];
    this.rulesDataInfo =[];
    let arrLabel = ['String', 'Integer', 'Decimal'];
    let arrValue = ['string', 'integer', 'decimal'];
    this.customValueType = ConfigUiUtility.createListWithKeyValue(arrLabel, arrValue);
  }

  ngOnInit() {
    this.loadHTTPReqHeaderDetails();
  }

  loadHTTPReqHeaderDetails(): void {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
    });
    console.log("profile id - ",this.profileId);
    // this.configKeywordsService.getFetchHTTPReqHeaderTable(this.profileId).subscribe(data => this.constructData(data));
  }


  // constructData(data) {
  //   this.httpRequestHdrInfo = this.filterTRData(data)
  // }
  //Code
  filterTRData(data): Array<HTTPRequestHdrComponentData> {
    var arrTestRunData = [];
    for (var i = 0; i < data.rules.length; i++) {
      let valueNames = "";
      // if (data.rules[i].attrValues == "") {
      //   if (data.rules[i].attrType == "complete")
      //     valueNames = "NA";
      //   else
      //     valueNames = "Add Values";
      // }
      // for (var j = 0; j < data.rules[i].attrValues.length; j++) {
      //   if (data.rules[i].attrValues.length == 1)
      //     valueNames = data.rules[i].attrValues[j].valName;
      //   else
      //     valueNames = valueNames + "," + data.attrList[i].attrValues[j].valName;
      // }

      arrTestRunData.push({
        attrName: data.rules[i].attrName, attrType: data.rules[i].attrType, valName: valueNames, sessAttrId: data.rules[i].sessAttrId,
      });
    }
    return arrTestRunData;
  }

  constructTableData(data) {
    console.log("data - ", data)
    for (let i = 0; i < data.length; i++) {
      this.httpRequestHdrComponentInfo = data[i];
    }
    this.httpRequestHdrComponentInfo = this.filterData(data)
    console.log("  this.httpRequestHdrComponentInfo == ", this.httpRequestHdrComponentInfo)
  }

  filterData(data): Array<httpReqHeaderInfo> {
    var arrData = [];
    for (var i = 0; i < data.length; i++) {
      let rules = "";
      let dumpModeTmp = "";

      if (data[i].dumpMode == '1')
        dumpModeTmp = 'Specific';
      else
        dumpModeTmp = 'Complete';

      for (var j = 0; j < data[i].rules.length; j++) {
        if (data[i].rules.length == 1)
          rules = data[i].rules[j].valName;
        else
          rules = data[i].rules[j].valName + "," + rules;
      }

      console.log("rules - ", rules)
      arrData.push({
        headerName: data[i].headerName, dumpMode: dumpModeTmp, rules: rules
      });
    }
    return arrData;

  }
  /* Open Dialog for Add Pattern */
  openAddHTTPReqDialog() {
    this.httpRequestHdrDetail = new HTTPRequestHdrComponentData();
    this.rulesData = new RulesHTTPRequestHdrComponentData();

    this.isNew = true;
    this.httpRequestCustomDialog = true;
  }

  /** This method is used to open a dialog for add Type Values
   */
  openHTTPReqTypeValueDialog() {
    // this.customValueTypeDetail = new SessionAtrributeComponetsData();
    this.rulesDialog = true;
  }

  saveADDEditHTTPReqHeader()
  {
    console.log("saveADDEditHTTPReqHeader called")
    
  }

  // Method for saving rules information
  saveRules()
  {
    console.log("rules data - ", this.rulesData);
    this.rulesDataInfo.push(this.rulesData);
    console.log("rules data - ", this.rulesDataInfo.length);
    this.rulesDialog = false;
  }

  deleteHTTPReqHeader() : void
  {
     if (!this.selectedHTTPReqHeader || this.selectedHTTPReqHeader.length < 1) {
      this.configUtilityService.errorMessage("Please select for delete");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let selectedApp = this.selectedHTTPReqHeader;
        console.log("selectedApp - ",selectedApp);
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].httpReqHdrBasedId);
        }
        console.log("arrAppIndex - ",arrAppIndex);
         this.configKeywordsService.deleteHTTPReqHeaderData(arrAppIndex)
          .subscribe(data => {
            this.deleteHTTPReqHeaderIndex(arrAppIndex);
            this.configUtilityService.infoMessage("Delete Successfully");
            this.selectedHTTPReqHeader = [];
          })
      },
      reject: () => {
      }
    });
  }

   /**This method is used to delete HTTP request from Data Table */
  deleteHTTPReqHeaderIndex(arrIndex) {
    let rowIndex: number[] = [];

    for (let index in arrIndex) {
      rowIndex.push(this.getHTTPReqHeaderIndex(arrIndex[index]));
    }
    this.httpRequestHdrDetail = deleteMany(this.httpRequestHdrDetail, rowIndex);
  }

  openMethodDialog() {
    this.httpRequestCustomDialog = true;
  }

  /**This method returns selected table data row on the basis of selected row */
  getHTTPReqHeaderIndex(id: any): number {

    for (let i = 0; i < this.httpRequestHdrComponentInfo.length; i++) {
      if (this.httpRequestHdrDetail[i].httpReqHdrBasedId == id) {
        return i;
      }
    }
    return -1;
  }
}
