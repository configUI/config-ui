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
  enableGroupKeyword: boolean = false;
  includedExceptionChk: boolean = true;
  excludedExceptionChk: boolean = true;

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
        console.log(" this.hotspot  at first time--", this.hotspot)
        if (this.hotspot["ASPositiveThreadFilters"].value == "NA")
          this.includedException = null;
        else
          this.includedException = this.hotspot["ASPositiveThreadFilters"].value.split("&");
        // this.includedExceptionChk = this.hotspot["ASPositiveThreadFilters"].value != null ? true : false;
        if (this.hotspot["ASNegativeThreadFilter"].value != null)
          this.excludedException = this.hotspot["ASNegativeThreadFilter"].value.split("&");

        this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == 1 ? true : false;
        console.log(this.className, "constructor", "this.hotspot", this.hotspot);
      });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.hotspot.enable);
    this.configKeywordsService.toggleKeywordData();
  }


  ngOnInit() {
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
    */
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

    this.hotspot["ASMethodHotspots"].value = this.hotspot["ASMethodHotspots"].value == true ? 1 : 0;
    console.log(" this.hotspot--",this.hotspot)
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

    
  }


  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
