import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigUiUtility } from '../../../../utils/config-utility';

import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.css']
})
export class HotspotComponent implements OnInit, OnDestroy {


  @Input()
  saveDisable: boolean;

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  className: string = "HotspotComponent";

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['ASSampleInterval', 'ASThresholdMatchCount', 'ASStackComparingDepth', 'ASPositiveThreadFilters', 'ASNegativeThreadFilter', 'ASMethodHotspots', 'maxStackSizeDiff', 'ASDepthFilter'];
  nodeJsKeywordList: string[] = ['ASSampleInterval', 'ASThresholdMatchCount', 'enableHSLongStack', ]

  /**It stores keyword data for showing in GUI */
  hotspot: any;
  copyHotspot: any;
  bindIncluded: boolean = false;
  bindExcluded: boolean = false;
  subscription: Subscription;
  exceptionName: string[];
  includedException;
  excludedException;
  includedExceptionChk: boolean = true;
  excludedExceptionChk: boolean = true;
  agentType: string = "";
  isProfilePerm: boolean;
  selectedStack: string = "";
  excludedEvent;
  stackType = [];
  maxStackDepth: any;

  /**Value for the keyword ASPositiveThreadFilters
   * Thread1&Thread2&Thread3
   * Value for the keyword ASNegativeThreadFilter
   * Thread1&Thread2&Thread3
  */

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.agentType = sessionStorage.getItem("agentType");
    this.subscription = this.store.select("keywordData")
      .subscribe(data => {
        var keywordDataVal = {}
        if(this.agentType == 'NodeJS'){
          this.nodeJsKeywordList.map(function (key) {
            keywordDataVal[key] = data[key];
          })
          this.hotspot = keywordDataVal;
        }
        else{
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        
                this.hotspot = keywordDataVal;
                if (this.hotspot["ASPositiveThreadFilters"].value == "NA")
                  this.includedException = null;
                else
                  this.includedException = this.hotspot["ASPositiveThreadFilters"].value.split("&");
                // this.includedExceptionChk = this.hotspot["ASPositiveThreadFilters"].value != null ? true : false;
                if (this.hotspot["ASNegativeThreadFilter"].value != null)
                  this.excludedException = this.hotspot["ASNegativeThreadFilter"].value.split("&");
                this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == 1 ? true : false;
      }
      });
    this.configKeywordsService.toggleKeywordData();
  }


  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if (this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    let stackVal = ['Disable', 'Simple', 'Merge'];
    this.stackType = ConfigUiUtility.createDropdown(stackVal);
    /**
     * Purpose: Method getKeywordData() is used to fetch all keyword data from server
     */
    this.getKeywordData();
  }

    getEventSelected() {
    if (this.selectedStack == "Disable" || this.selectedStack == "" || this.selectedStack == null) {
      this.hotspot["enableHSLongStack"].value = this.hotspot["enableHSLongStack"].defaultValue;
      this.methodToSetValue(this.hotspot);
    }
  }
  /* This method is used to get the existing keyword data from the backend */
  getKeywordData() {

    // let keywordData = this.configKeywordsService.keywordData;
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      if(this.agentType == 'NodeJS'){
        this.nodeJsKeywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
      }
      else{
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
    }
      this.hotspot = keywordDataVal;
      this.methodToSetValue(this.hotspot)
    });
  }
  //This method is used to set value of data depending on data received in its argument
  methodToSetValue(data) {
    this.hotspot = data;
    for (let key in this.hotspot) {
      if (key == 'enableHSLongStack') {
        let str = this.hotspot[key]["value"];
        let arr = str.split("%")
        if (arr[0] == "0") {
          this.selectedStack = "Disable";
        }
        if (arr[0] == "1") {
          this.selectedStack = "Simple";
        }
        if (arr[0] == "2") {
          this.selectedStack = "Merge";
        }
        this.maxStackDepth = arr[1];
        this.excludedEvent = arr[2].split(",");
      }
    }
  }


  /*
  *  ASMethodHotspots = 0/1 value to be wriiten in file
  * so its value = false/true is conerted to "0/1" beforre sending to server
  */

  saveKeywordData() {
    //Joining the values of ASNegativeThreadFilter and ASPositiveThreadFilters keywords with &.
    /*
    *  ASPositiveThreadFilters is given the defaultValue
    *  so if there is a change in that default value it automatically refers to that value and we need to made the change in only one file
    *  this is done to handle the case of writing keywords as:
    *     'ASpositivethreadFilter='' ;  default value of this keyword is "NA"
    * 
    */
if(this.agentType != 'NodeJS'){
    if (this.hotspot["ASPositiveThreadFilters"].value != null && this.hotspot["ASPositiveThreadFilters"].value.length != 0 && this.includedException != null) {
      this.hotspot["ASPositiveThreadFilters"].value = this.includedException.join("&");
    }
    else {
      this.hotspot["ASPositiveThreadFilters"].value = this.hotspot["ASPositiveThreadFilters"].defaultValue;
    }

    if (this.excludedException != null && this.excludedException.length != 0) {
      this.hotspot["ASNegativeThreadFilter"].value = this.excludedException.join("&");
    }

    else {
      this.hotspot["ASNegativeThreadFilter"].value = this.hotspot["ASNegativeThreadFilter"].defaultValue;
    }

    if (this.includedException != null) {
      if (this.includedException.length < 1) {
        this.hotspot["ASPositiveThreadFilters"].value = "NA";
        this.includedException = null;
      }
    }
    this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == true ? 1 : 0;
  }
    if (this.agentType == "NodeJS") {
      /**
       * Validating and modifying input data in order to make
       * it a proper value to pass it as keyword value  for keyword : enableHSLongStack
       */
      if (this.selectedStack == "Disable" || this.selectedStack == "") {
        this.hotspot["enableHSLongStack"].value = this.hotspot["enableHSLongStack"].defaultValue;
      }
      else {
        let stackTypeValue;
        if (this.selectedStack == "Simple") {
          stackTypeValue = "1";
        }
        if (this.selectedStack == "Merge") {
          stackTypeValue = "2";
        }
        if (this.excludedEvent != null && this.excludedEvent.length != 0) {
          this.hotspot["enableHSLongStack"].value = stackTypeValue + "%" + this.maxStackDepth + "%" + this.excludedEvent.join(",");
        }
        else {
          let str = this.hotspot["enableHSLongStack"].defaultValue;
          this.hotspot["enableHSLongStack"].value = stackTypeValue + "%" + this.maxStackDepth + "%" + str.substring(str.lastIndexOf('%') + 1, str.length);
        }
      }
    }
    this.keywordData.emit(this.hotspot);
  }

  resetKeywordData() {
    this.hotspot = cloneObject(this.configKeywordsService.keywordData);
    if (this.hotspot["ASPositiveThreadFilters"].value == "NA")
      this.includedException = null;
    else
      this.includedException = this.hotspot["ASPositiveThreadFilters"].value.split("&");
    // this.includedExceptionChk = this.hotspot["ASPositiveThreadFilters"].value != null ? true : false;
    if (this.hotspot["ASNegativeThreadFilter"].value != null)
      this.excludedException = this.hotspot["ASNegativeThreadFilter"].value.split("&");
    this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == 1 ? true : false;
    if (this.agentType == "NodeJS") {
      this.methodToSetValue(this.hotspot);
    }
  }
  //To reset the Keywords to its Default value
  resetKeywordsDataToDefault() {
    let data = cloneObject(this.configKeywordsService.keywordData);
    var keywordDataVal = {}
    keywordDataVal = data
    if(this.agentType == 'NodeJS'){
      this.nodeJsKeywordList.map(function (key) {
        keywordDataVal[key].value = data[key].defaultValue
      })
      this.hotspot = keywordDataVal;
    }
    else{
      this.keywordList.map(function (key) {
        keywordDataVal[key].value = data[key].defaultValue
      })
      this.hotspot = keywordDataVal;
      if (this.hotspot["ASPositiveThreadFilters"].value == "NA")
        this.includedException = null;
      else
        this.includedException = this.hotspot["ASPositiveThreadFilters"].value.split("&");
      // this.includedExceptionChk = this.hotspot["ASPositiveThreadFilters"].value != null ? true : false;
      if (this.hotspot["ASNegativeThreadFilter"].value != null)
        this.excludedException = this.hotspot["ASNegativeThreadFilter"].value.split("&");
  
      this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == 1 ? true : false;
      this.hotspot["enableHSLongStack"].value = this.hotspot["enableHSLongStack"].defaultValue;
    }

    if (this.agentType == "NodeJS") {
      this.methodToSetValue(this.hotspot)
    }
  }
  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog 
   * related to the current component.
   */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("General", "Hotspot", this.agentType);
  }

  ngOnDestroy() {
    if(this.agentType != 'NodeJS')
      this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == true ? 1 : 0;
    if (this.subscription)
      this.subscription.unsubscribe();
    //  if(this.subscriptionEG)
    //    this.subscriptionEG.unsubscribe();
  }
}
