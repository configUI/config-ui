import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
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

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  className: string = "HotspotComponent";

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['ASSampleInterval', 'ASThresholdMatchCount', 'ASReportInterval', 'ASDepthFilter', 'ASTraceLevel', 'ASStackComparingDepth','ASPositiveThreadFilters','ASNegativeThreadFilter'];

  /**It stores keyword data for showing in GUI */
  hotspot: any;
  copyHotspot: any;
  bindIncluded:boolean=false;
  bindExcluded:boolean=false;
  subscription: Subscription;
  exceptionName:string[];
  includedException;
  excludedException;
  enableGroupKeyword: boolean = false;

  /**Value for the keyword ASPositiveThreadFilters
   * Thread1&Thread2&Thread3
   * Value for the keyword ASNegativeThreadFilter
   * Thread1&Thread2&Thread3
  */

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.subscription = this.store.select("keywordData")
      .subscribe(data => {
        var keywordDataVal={}
        this.keywordList.map(function(key){
          keywordDataVal[key] = data[key];
        })
        this.hotspot = keywordDataVal;
        console.log(this.className, "constructor", "this.hotspot", this.hotspot);
      });
    this.enableGroupKeyword = this.configKeywordsService.keywordGroup.general.hotspot.enable;
  }

  ngOnInit() {
  }

  saveKeywordData() {
    //Joining the values of ASNegativeThreadFilter and ASPositiveThreadFilters keywords with &.
    this.hotspot["ASPositiveThreadFilters"].value = this.hotspot["ASPositiveThreadFilters"].value.join("&");
    this.hotspot["ASNegativeThreadFilter"].value = this.hotspot["ASNegativeThreadFilter"].value.join("&");
    this.keywordData.emit(this.hotspot);
  }

  resetKeywordData(){
     this.hotspot = cloneObject(this.configKeywordsService.keywordData);
  }


  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }


}
