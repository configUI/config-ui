import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { cloneObject } from '../../../../utils/config-utility';
import { Messages } from '../../../../constants/config-constant'

@Component({
  selector: 'app-nvcookie',
  templateUrl: './nvcookie.component.html',
  styleUrls: ['./nvcookie.component.css']
})
export class NVCookieComponent implements OnInit {
  @Input()
  saveDisable: boolean;
  @Output()
  keywordData = new EventEmitter();
  className: "NVCookieComponent";
  keywordsData: Keywords;
  keywordList: string[] = ['enableNDSession'];
  //It stores data for showing in GUI
  ndSession: Object;
  ndSessionData: NDSessionData;
  subscription: Subscription;
  subscriptionEG: Subscription;

  enableGroupKeyword: boolean;
  isProfilePerm: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService) {
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.ndSession = keywordDataVal;
    });
    this.enableGroupKeyword = this.configKeywordsService.keywordGroup.product_integration.nvcookie.enable;

  }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.splitNDSessionKeywordValue();

  }
  //Method to split the enableNDSession keyword values by %20
  splitNDSessionKeywordValue() {
    if ((this.ndSession["enableNDSession"].value).includes("%20")) {
      let arr = this.ndSession["enableNDSession"].value.split("%20");
      this.ndSessionData = new NDSessionData();
      this.ndSessionData.methodEntryDepth = arr[0];
      this.ndSessionData.methodExitDepth = arr[1];
      this.ndSessionData.onResponseCommit = arr[2];
      this.ndSessionData.setResponseHeader = arr[3];
      this.ndSessionData.cookieName = arr[4];
      this.ndSessionData.domain = arr[5];
      this.ndSessionData.idleTimeOut = arr[6];
      this.ndSessionData.maxFPAllowedInSession = arr[7];
      //Changing values of checkboxes from 0/1 to false/true
      this.ndSessionData.methodEntryDepth = this.ndSessionData.methodEntryDepth == 0 ? false : true;
      this.ndSessionData.methodExitDepth = this.ndSessionData.methodExitDepth == 0 ? false : true;
      this.ndSessionData.onResponseCommit = this.ndSessionData.onResponseCommit == 0 ? false : true;
      this.ndSessionData.setResponseHeader = this.ndSessionData.setResponseHeader == 0 ? false : true;

    }
    else {
      if (this.ndSession["enableNDSession"].value == 0) {

        this.ndSessionData = new NDSessionData();
        this.ndSessionData.methodEntryDepth = 1;
        this.ndSessionData.methodExitDepth = 1;
        this.ndSessionData.onResponseCommit = 1;
        this.ndSessionData.setResponseHeader = 1;
        this.ndSessionData.cookieName = "CavNV";
        this.ndSessionData.domain = null;
        this.ndSessionData.idleTimeOut = 1800;
        this.ndSessionData.maxFPAllowedInSession = 1000;
      }
      if (this.ndSession["enableNDSession"].value == 1) {

        this.ndSessionData = new NDSessionData();
        this.ndSessionData.methodEntryDepth = 1;
        this.ndSessionData.methodExitDepth = 1;
        this.ndSessionData.onResponseCommit = 1;
        this.ndSessionData.setResponseHeader = 1;
        this.ndSessionData.cookieName = "CavNV";
        this.ndSessionData.domain = null;
        this.ndSessionData.idleTimeOut = 1800;
        this.ndSessionData.maxFPAllowedInSession = 1000;
      }
    }

  }

  saveKeywordData(data) {
    let ndSessionValue = this.ndSessionValueMethod(data);
    for (let key in this.ndSession) {
      if (key == 'enableNDSession')
        this.ndSession[key]["value"] = ndSessionValue;
    }
    this.keywordData.emit(this.ndSession);
  }

  //To create the value of the keyword "enableNDSession" by joining them with %20
  ndSessionValueMethod(data) {


    //Converting values of checkboxes from true/false to 1/0
    this.ndSessionData.methodEntryDepth = this.ndSessionData.methodEntryDepth ? 1 : 0;
    this.ndSessionData.methodExitDepth = this.ndSessionData.methodExitDepth ? 1 : 0;
    this.ndSessionData.onResponseCommit = this.ndSessionData.onResponseCommit ? 1 : 0;
    this.ndSessionData.setResponseHeader = this.ndSessionData.setResponseHeader ? 1 : 0;

    let keyVal = `${this.ndSessionData.methodEntryDepth}%20${this.ndSessionData.methodExitDepth}%20${this.ndSessionData.onResponseCommit}%20${this.ndSessionData.setResponseHeader}%20${this.ndSessionData.cookieName}%20${this.ndSessionData.domain}%20${this.ndSessionData.idleTimeOut}%20${this.ndSessionData.maxFPAllowedInSession}`;
    return keyVal;
  }

  resetKeywordData() {
    this.ndSession = cloneObject(this.configKeywordsService.keywordData);
    this.splitNDSessionKeywordValue();
  }

}

class NDSessionData {
  methodEntryDepth;
  methodExitDepth;
  onResponseCommit;
  setResponseHeader;
  cookieName;
  domain;
  idleTimeOut;
  maxFPAllowedInSession;
}
