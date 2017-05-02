import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';

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
  keywordList: string[] = ['ASSampleInterval', 'ASThresholdMatchCount', 'ASReportInterval', 'ASTraceLevel', 'ASStackComparingDepth', 'ASPositiveThreadFilters', 'ASNegativeThreadFilter', 'ASMethodHotspots', 'maxStackSizeDiff'];

  /**It stores keyword data for showing in GUI */
  hotspot: any;
  copyHotspot: any;
  bindIncluded: boolean = false;
  bindExcluded: boolean = false;
  subscription: Subscription;
  subscriptionEG: Subscription;
  exceptionName: string[];
  includedException;
  excludedException;
  includedExceptionChk: boolean = false;
  excludedExceptionChk: boolean = false;
  enableGroupKeyword: boolean = false;

  /**Value for the keyword ASPositiveThreadFilters
   * Thread1&Thread2&Thread3
   * Value for the keyword ASNegativeThreadFilter
   * Thread1&Thread2&Thread3
  */

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.subscription = this.store.select("keywordData")
      .subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })

        this.hotspot = keywordDataVal;
        this.includedException = this.hotspot["ASPositiveThreadFilters"].value.split("&");
        // this.includedExceptionChk = this.hotspot["ASPositiveThreadFilters"].value != null ? true : false;
        this.excludedException = this.hotspot["ASNegativeThreadFilter"].value.split("&");
        this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == '1';
        console.log("--this.includedException--", this.includedException);
        console.log(this.className, "constructor", "this.hotspot", this.hotspot);
      });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.hotspot.enable);
  }


  ngOnInit() {
  }

  /*
  *  ASMethodHotspots = 0/1 value to be wriiten in file
  * so its value = false/true is conerted to "0/1" beforre sending to server
  */

  saveKeywordData() {
    //Joining the values of ASNegativeThreadFilter and ASPositiveThreadFilters keywords with &.
    console.log("--this.hotspotvalue--", this.hotspot["ASPositiveThreadFilters"].value);
    // if(this.hotspot["ASPositiveThreadFilters"].value != null && this.hotspot["ASPositiveThreadFilters"].value != "NA"  ){
    //    this.hotspot["ASPositiveThreadFilters"].value = this.hotspot["ASPositiveThreadFilters"].value.join("&");
    //    console.log("this.hotspot['ASPositiveThreadFilters'].value ",this.hotspot["ASPositiveThreadFilters"].value );
    // }
    //  if(this.hotspot["ASNegativeThreadFilter"].value != null &&  this.hotspot["ASNegativeThreadFilter"].value != "NDControlConnection" ){
    //    this.hotspot["ASNegativeThreadFilter"].value = this.hotspot["ASNegativeThreadFilter"].value.join("&");
    //   console.log("this.hotspotaaavalue------------------------------------",this.hotspot["ASPositiveThreadFilters"].value);
    // }
    console.log("includeException",this.includedExceptionChk);
    console.log("excludedExceptionChk",this.excludedExceptionChk);
    console.log("--includedException--", this.includedException);
    console.log("--excludeException--",this.excludedException);
    if (this.includedExceptionChk == true && this.hotspot["ASPositiveThreadFilters"].value !="NA" && this.hotspot["ASPositiveThreadFilters"].value != null) {
      this.hotspot["ASPositiveThreadFilters"].value = this.includedException.join("&");
      console.log("hello", this.includedException);
    }
    // else if(this.includedExceptionChk != true && this.hotspot["ASPositiveThreadFilters"].value != null){
    //   console.log("hi..",this.hotspot["ASPositiveThreadFilters"].value );
    //   this.hotspot["ASPositiveThreadFilters"].value = "NA";
    // }
    if (this.excludedExceptionChk == true && this.hotspot["ASNegativeThreadFilter"].value != "NDControlConnection" && this.hotspot["ASNegativeThreadFilter"].value != null) {
      this.hotspot["ASNegativeThreadFilter"].value = this.excludedException.join("&");
      console.log("hey",this.excludedException);
    }
    // else if(this.excludedExceptionChk == false && this.excludedException != null){
    //   console.log("how r u",this.hotspot["ASNegativeThreadFilter"].value);
    //   this.hotspot["ASNegativeThreadFilter"].value = "NDControlConnection";
    // }
    this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value ? '1' : '0';
    this.keywordData.emit(this.hotspot);
  }

  resetKeywordData() {
    this.hotspot = cloneObject(this.configKeywordsService.keywordData);
  }


  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }


}
