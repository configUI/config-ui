import { Component, OnInit } from '@angular/core';
import { ConfigUiUtility } from '../../../../../../utils/config-utility';
import { ConfigKeywordsService } from '../../../../../../services/config-keywords.service';
import { HTTPRequestHdrComponentData,RulesHTTPRequestHdrComponentData } from '../../../../../../containers/instrumentation-data';
import { httpReqHeaderInfo } from '../../../../../../interfaces/httpReqHeaderInfo';
import { ConfigUtilityService } from '../../../../../../services/config-utility.service';
import { SelectItem,ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute, Params } from '@angular/router';

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
  selectedRulesData : any;

  customValueType: SelectItem[];
  
  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService,private confirmationService: ConfirmationService) {
    this.customValueType = [];
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
    this.configKeywordsService.getFetchHTTPReqHeaderTable('/29046').subscribe(data => this.constructTableData(data));
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

  deleteHeader() : void
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
        let arrAppIndex = [];
        for (let index in selectedApp) {
          arrAppIndex.push(selectedApp[index].httpReqHdrBasedId);
        }
        this.configKeywordsService.deleteBusinessTransMethodData(arrAppIndex, '/29046')
          .subscribe(data => {
            // this.deleteMethodsBusinessTransactions(arrAppIndex);
            // this.selectedbusinessTransMethod = [];
            this.configUtilityService.infoMessage("Delete Successfully");
          })
      },
      reject: () => {
      }
    });
  }
}
