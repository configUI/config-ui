import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent {
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;

  className: string = "DebugComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  keywordList = ['enableBciDebug',
                  'enableBciError',
                  'InstrTraceLevel',
                  'ndMethodMonTraceLevel',
                  'ASDepthFilter',
                  'captureErrorLogs'  // its value = 0/1/2  related to capturing exception related logs
                  ];

  /**It stores keyword data for showing in GUI */
  debug: Object;
  enableGroupKeyword: boolean;
  subscription: Subscription;
  subscriptionEG: Subscription;
  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {


    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.debug = keywordDataVal;
      console.log(this.className, "constructor", "this.debug", this.debug);
    });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.debug.enable);
    this.configKeywordsService.toggleKeywordData();
  }

  ngOnInit() {
  }

  saveKeywordData() {
    this.keywordData.emit(this.debug);

  }
  //Method to reset the default values of the keywords
  resetKeywordData() {
    this.debug = cloneObject(this.configKeywordsService.keywordData);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionEG)
      this.subscriptionEG.unsubscribe();
  }
}
