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
  keywordList: string[] = ['ASSampleInterval', 'ASThresholdMatchCount', 'ASReportInterval', 'ASDepthFilter', 'ASTraceLevel', 'ASStackComparingDepth'];

  /**It stores keyword data for showing in GUI */
  hotspot: any;
  copyHotspot: any;
  bindIncluded:boolean=false;
  bindExcluded:boolean=false;
  subscription: Subscription;
  exceptionName:string[];
  enableGroupKeyword: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.subscription = this.store.select("keywordData")
      .subscribe(data => {
        this.hotspot = data;
        console.log(this.className, "constructor", "this.hotspot", this.hotspot);
      });

    this.enableGroupKeyword = this.configKeywordsService.keywordGroup.general.hotspot.enable;
  }

  ngOnInit() {
  }

  saveKeywordData() {
    this.keywordData.emit(this.hotspot);
    this.configUtilityService.successMessage("Saved Successfully !!!");

  }

  resetKeywordData(){
     this.hotspot = cloneObject(this.configKeywordsService.keywordData);
  }

  showExceptionNameText(){
    if(this.bindIncluded==false)
      this.bindIncluded=true;
    else
      this.bindIncluded=false;
  }
  showExcludedExceptionNameText(){
    if(this.bindExcluded==false)
      this.bindExcluded=true;
    else
      this.bindExcluded=false;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }


}
