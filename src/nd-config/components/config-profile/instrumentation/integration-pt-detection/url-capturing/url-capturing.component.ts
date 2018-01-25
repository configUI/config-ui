import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { UrlCapturingData } from '../../../../../containers/instrumentation-data';
import { cloneObject } from '../../../../../utils/config-utility';
import { ConfigurationComponent } from '../../../configuration/configuration.component';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-url-capturing',
  templateUrl: './url-capturing.component.html',
  styleUrls: ['./url-capturing.component.css']
})
export class UrlCapturingComponent implements OnInit {
  @Input()
  profileId: number;
  @Input()
  data;
  saveDisable: boolean;
  index: number = 0;

  /**This is to send data to parent component(Instrumentation Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();
  urlCapturing: Object;
  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['formatIPResourceURL', 'enableIPResourceURL', 'dumpDefaultCassandraQuery', 'enableTransformThreadSubClass'];
  subscriptionEG: Subscription;
  enableGroupKeyword: boolean;
  keywordValue: Object;
  isProfilePerm: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.configKeywordsService.toggleKeywordData();
  }

  urlCapturingData: UrlCapturingData;
  subscription: Subscription;
  urlForm: boolean = true;
  // selectedValues: boolean;
  enableFormatIPResourceURL: boolean;

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if(this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
       this.saveDisable =  true;
      this.index = params['tabId'];
    });
    this.urlCapturingData = new UrlCapturingData();
    this.getKeywordData();
  }

  /* This method is used to save the formatIPResourceURL data in the backend*/
  saveKeywordData() {
    let formatIPVal = this.formatIPResourceURLValue();
    for (let key in this.urlCapturing) {
      if (key == 'formatIPResourceURL')
        this.urlCapturing[key]["value"] = formatIPVal;
    }
    this.keywordData.emit(this.urlCapturing);
  }

  /* This method is used to reset the keyword data*/
  resetKeywordData() {
    this.getKeywordData();
    if (this.urlCapturing["formatIPResourceURL"].value == "0") {
      this.enableFormatIPResourceURL = false;
      this.urlCapturingData.includeParameter = false;
      this.urlCapturingData.urlOffset = null;
      this.urlCapturingData.maxChar = null;
    }
    else
    {
      this.urlCapturing = cloneObject(this.configKeywordsService.keywordData);
      this.enableFormatIPResourceURL = true;
    }
  }

  /* This method is used to get the existing value of keyword from the backend*/
  getKeywordData() {
    let keywordData = this.configKeywordsService.keywordData;
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
    this.urlCapturing = {};

    this.keywordList.forEach((key) => {
      if (this.keywordValue.hasOwnProperty(key)) {
        this.urlCapturing[key] = this.keywordValue[key];
      }
    });
    if ((this.urlCapturing["formatIPResourceURL"].value).includes("%20")) {

      let arr = (this.urlCapturing["formatIPResourceURL"].value).split("%20")
      this.urlCapturingData = new UrlCapturingData();
      this.enableFormatIPResourceURL = true;

      if (arr[0] === "0") {
        this.urlCapturingData.includeParameter = false;
      }
      else if (arr[0] === "1") {
        this.urlCapturingData.includeParameter = true;
      }
      else
        this.urlCapturingData.includeParameter = false;

        this.urlCapturingData.urlOffset = arr[1];
        this.urlCapturingData.maxChar = arr[2];
    }

   else if(this.urlCapturing["formatIPResourceURL"].value == "1"){
      this.urlCapturingData = new UrlCapturingData();
      this.enableFormatIPResourceURL = true;
        this.urlCapturingData.includeParameter = false;
        this.urlCapturingData.urlOffset = 0;
        this.urlCapturingData.maxChar = 50;
    }
    else {
      this.urlCapturingData = new UrlCapturingData();
      this.enableFormatIPResourceURL = false;
        this.urlCapturingData.includeParameter = false;
        this.urlCapturingData.urlOffset = 0;
        this.urlCapturingData.maxChar = 50;
    }
  }

  /**Value for this keyword is
  * 1%205%2010
  * 1-  Enable includeParameter // It can be 0 or 1 [0 - disable , 1 - enable]
  * 5- url offset
  * 10- maximum characters
  */

  // Method used to construct the value of formatIPResourceURL keyword.
  formatIPResourceURLValue() {
    var formatIPVal = {};
     if (this.enableFormatIPResourceURL == true) {
         if (this.urlCapturingData.includeParameter == true)
            formatIPVal = "1";
         else
            formatIPVal = "0";
         if (this.urlCapturingData.urlOffset != null)
            formatIPVal = formatIPVal + "%20" + this.urlCapturingData.urlOffset;
         else
            formatIPVal = formatIPVal + "%200";

         if (this.urlCapturingData.maxChar != null)
            formatIPVal = formatIPVal + "%20" + this.urlCapturingData.maxChar;
         else
            formatIPVal = formatIPVal + "%2050";

      return formatIPVal;
     }
     else {
      return 0;
     }
  }


  checkOffset(offset, maxChar) {
    if (this.urlCapturingData.urlOffset >= this.urlCapturingData.maxChar) {
      offset.setCustomValidity('urlOffset value should be less than maxChar value.');
    }
    else {
      offset.setCustomValidity('');
    }
    maxChar.setCustomValidity('');

  }

  checkMaxChar(offset, maxChar) {
    if (this.urlCapturingData.urlOffset >= this.urlCapturingData.maxChar) {
      maxChar.setCustomValidity('maxChar value should be greater than urlOffset value.');
    }
    else {
      maxChar.setCustomValidity('');
    }
    offset.setCustomValidity('');
  }
}
