import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-flowpath',
  templateUrl: './flowpath.component.html',
  styleUrls: ['./flowpath.component.css']
})

export class FlowpathComponent implements OnInit, OnDestroy {

  @Input()
  saveDisable: boolean;

  @Output()
  keywordData = new EventEmitter();

  keywordList = ['bciInstrSessionPct', 'enableCpuTime', 'enableForcedFPChain', 'correlationIDHeader'];

  flowPath: Object;
  cpuTime: string = '1';

  subscription: Subscription;
  subscriptionEG: Subscription;
  enableGroupKeyword: boolean = false;
  // enableCaptureHeader: boolean = false;
  correlationIDHeader: any;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<Object>) {
    this.subscription = this.store.select("keywordData").subscribe(data => {
      // this.flowPath = data
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.flowPath = keywordDataVal;

      this.cpuTime = this.flowPath['enableCpuTime'].value;
      // this.enableCaptureHeader = this.flowPath['correlationIDHeader'];
      this.correlationIDHeader = this.flowPath['correlationIDHeader'].value;
    });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.flowpath.enable);
    this.configKeywordsService.toggleKeywordData();
  }

  enableForcedFPChainSelectItem: SelectItem[];
  enableCpuTimeSelectItem: SelectItem[];
  keywordsData: Keywords;

  ngOnInit() {
  }

  getKeywordData() {
    // let keywordData = this.configKeywordsService.keywordData;
    // this.flowPath = {}
    // this.keywordList.forEach((key)=>{
    //   if(keywordData.hasOwnProperty(key)){
    //     this.flowPath[key] = keywordData[key];
    //   }
    // });
  }

  saveKeywordData() {
    if (this.correlationIDHeader != null && this.correlationIDHeader != "" && this.correlationIDHeader != "-")
      this.flowPath["correlationIDHeader"].value = this.correlationIDHeader;
    else
      this.flowPath["correlationIDHeader"].value = this.flowPath["correlationIDHeader"].defaultValue;

    this.flowPath['enableCpuTime'].value = this.cpuTime;
    this.keywordData.emit(this.flowPath);
  }

  resetKeywordData() {
    this.flowPath = cloneObject(this.configKeywordsService.keywordData);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionEG)
      this.subscriptionEG.unsubscribe();
  }
}
