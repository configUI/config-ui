import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigUiUtility } from '../../../../utils/config-utility';
import { SelectItem } from 'primeng/primeng';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { cloneObject } from '../../../../utils/config-utility';
import { ConfigCustomDataService } from '../../../../services/config-customdata.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;


  HeaderForm: boolean = true;

  subscription: Subscription;
  // subscriptionEG: Subscription;
  isProfilePerm: boolean;
  // enableGroupKeyword: boolean = false;

  /*holding keyword data and sending to its child component
  * i.e so that when its values is changed at child
  * it can be acessed from its parent i.e its current component
  */
  header: Object;           //it is send to customData child component
  httpKeywordObject: any[];  //it is send to httpheaders child component


  httpReqFullFp: HttpReqFullFp;
  httpRespFullFp: HttpRespFullFp;

  keywordList = ['captureHTTPReqFullFp', 'captureHTTPRespFullFp'];

  profileId: number;

  /* here value of keyworsds should be boolean but from server sides it is giving string so converting it to
   *  to boolean value
   */
  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<Object>, private configCustomDataService: ConfigCustomDataService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService) {
    this.subscription = this.store.select("keywordData").subscribe(data => {
      if (!data)
        return;
      for (let key in data) {
        data[key].value = (data[key].value == 'true' || data[key].value == 'false') ? data[key].value == 'true' : data[key].value
      }
      this.header = data;
    });
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.header = keywordDataVal;
    });
    // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.header.enable);
    this.configKeywordsService.toggleKeywordData();
    this.httpKeywordObject = [];
  }


  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if(this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    this.splitKeywordData(this.header)
  }

  /*
``* Here value of keyword should be as:
  * 3%20ALL%201%2030
  * here 3 = enables
  *     ALL = captureMode ,if Specified headers selected ,headers Name is written instead of ALL
  */

  constructValHttpReqFullFp(httpReqkeyword) {
    let httpReqFullFpVal = '0';

    if (httpReqkeyword.enableHttpReq && httpReqkeyword.headerMode == 0)
      httpReqFullFpVal = '2';
    if (httpReqkeyword.enableHttpReq && httpReqkeyword.headerMode != 0) {
      httpReqFullFpVal = "3%20"
      if (httpReqkeyword.headerMode != 'All') {
        let val = '';
        for (var i = 0; i < httpReqkeyword.headersName.length; i++) {
          if (i == (httpReqkeyword.headersName.length - 1))
            val = val + httpReqkeyword.headersName[i]
          else
            val = val + httpReqkeyword.headersName[i] + ','
        }
        httpReqFullFpVal = httpReqFullFpVal + val + "%20";
      }
      else {
        httpReqFullFpVal = httpReqFullFpVal + "ALL%20";
        httpReqkeyword.headersName = [];
      }

      if (httpReqkeyword.captureMode == 1)
        httpReqFullFpVal = httpReqFullFpVal + "1%20" + httpReqkeyword.briefVal;
      else
        httpReqFullFpVal = httpReqFullFpVal + "0";
    }
    return httpReqFullFpVal;
  }

  constructValHttpRespFullFp(httpRespKeyword) {
    let httpRespFullFpVal = '0';

    if (httpRespKeyword.enableHttpResp && httpRespKeyword.headerModeResp == 0)
      httpRespFullFpVal = '1';
    if (httpRespKeyword.enableHttpResp && httpRespKeyword.headerModeResp != 0) {
      httpRespFullFpVal = "2%20"

      if (httpRespKeyword.headerModeResp != 'All') {
        let val = '';
        for (var i = 0; i < httpRespKeyword.headersNameResp.length; i++) {
          if (i == (httpRespKeyword.headersNameResp.length - 1))
            val = val + httpRespKeyword.headersNameResp[i]
          else
            val = val + httpRespKeyword.headersNameResp[i] + ','
        }
        httpRespFullFpVal = httpRespFullFpVal + val + "%20";
      }
      else {
        httpRespFullFpVal = httpRespFullFpVal + "ALL%20";
        httpRespKeyword.headersNameResp = [];
      }

      if (httpRespKeyword.captureModeResp == 1)
        httpRespFullFpVal = httpRespFullFpVal + "1%20" + httpRespKeyword.briefValResp;
      else
        httpRespFullFpVal = httpRespFullFpVal + "0";
    }
    return httpRespFullFpVal;
  }


  saveKeywordData() {
    this.route.params.subscribe((params: Params) => this.profileId = params['profileId']);
    let captureHttpReqFullFpVal = this.constructValHttpReqFullFp(this.httpKeywordObject[0]);
    let captureHttpRespFullFpVal = this.constructValHttpRespFullFp(this.httpKeywordObject[1]);

    this.header["captureHTTPReqFullFp"].value = captureHttpReqFullFpVal;
    this.header["captureHTTPRespFullFp"].value = captureHttpRespFullFpVal;
    this.keywordData.emit(this.header);
  }

  splitKeywordData(keywords) {
    this.httpReqFullFp = new HttpReqFullFp();
    this.httpRespFullFp = new HttpRespFullFp();
    if ((keywords["captureHTTPReqFullFp"].value).includes("%20")) {
      let arr = (keywords["captureHTTPReqFullFp"].value).split("%20")
      this.httpReqFullFp.enableHttpReq = arr[0] == 3;
      this.httpReqFullFp.headerMode = arr[1] == "ALL" ? "ALL" : "Specified";
      let arrVal = [];
      if (arr[1].includes(",") || arr[1] != "ALL") {
        arrVal = arr[1].split(",")
      }
      this.httpReqFullFp.headersName = arrVal;
      this.httpReqFullFp.captureMode = arr[2] == 1;
      this.httpReqFullFp.briefVal = arr[2] == 1 ? arr[3] : '';
    }
    else if (keywords["captureHTTPReqFullFp"].value == '2') {
      this.httpReqFullFp.enableHttpReq = true;
    }

    if ((keywords["captureHTTPRespFullFp"].value).includes("%20")) {
      let arr = (keywords["captureHTTPRespFullFp"].value).split("%20")
      this.httpRespFullFp.enableHttpResp = arr[0] == 3;
      this.httpRespFullFp.headerModeResp = arr[1] == "ALL" ? "ALL" : "Specified";
      let arrVal = [];
      if (arr[1] != "ALL" || arr[1].includes(",")) {
        arrVal = arr[1].split(",")
      }
      this.httpRespFullFp.headersNameResp = arrVal;
      this.httpRespFullFp.captureModeResp = arr[2] == 1;
      this.httpRespFullFp.briefValResp = arr[2] == 1 ? arr[3] : '';
      this.httpRespFullFp.enableHttpResp = true;
    }
    else if (keywords["captureHTTPRespFullFp"].value == '1') {
      this.httpRespFullFp.enableHttpResp = true;
    }


    this.httpKeywordObject = [];
    this.httpKeywordObject.push(this.httpReqFullFp)
    this.httpKeywordObject.push(this.httpRespFullFp)


  }

  resetKeywordData() {
    this.header = cloneObject(this.configKeywordsService.keywordData);
    this.splitKeywordData(this.header);
  }

}
//Contains httpReqFullFp Keyword variables
class HttpReqFullFp {
  enableHttpReq: boolean = false;
  headerMode: any = 0;
  headersName: any = [];
  captureMode: boolean = false;
  briefVal: string = '0';
}

//Contains httpRespFullFp Keyword variables
class HttpRespFullFp {
  enableHttpResp: boolean = false;
  headerModeResp: any = 0;
  headersNameResp: any = [];
  captureModeResp: boolean = false;
  briefValResp: string = '0';
}


