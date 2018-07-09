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
                  'captureErrorLogs'  // its value = 0/1/2  related to capturing exception related logs
                  ];

  /**It stores keyword data for showing in GUI */
  debug: Object;
  agentType: string = "";
  isProfilePerm: boolean;
 // enableGroupKeyword: boolean;
  subscription: Subscription;
 // subscriptionEG: Subscription;
  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {

    this.agentType = sessionStorage.getItem("agentType");    
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.debug = keywordDataVal;
      console.log(this.className, "constructor", "this.debug", this.debug);
    });
   // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.debug.enable);
    this.configKeywordsService.toggleKeywordData();
  }

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if(this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
  }

  saveKeywordData() {
    this.keywordData.emit(this.debug);

  }
  //Method to reset the default values of the keywords
  resetKeywordData() {
    this.getKeyWordDataFromStore();
  }
  getKeyWordDataFromStore(){
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.debug = keywordDataVal;
      console.log(this.className, "constructor", "this.debug", this.debug);
    });
  }
 /* This method is used to reset the keyword data to its Default value */
  resetKeywordsDataToDefault() {
    // let data = cloneObject(this.configKeywordsService.keywordData);
    let data = this.configKeywordsService.keywordData;
    for(let key in data){
      if(this.keywordList.includes(key)){
        this.debug[key] = data[key];
      }
    }
    var keywordDataVal = {}
    keywordDataVal = this.debug
    this.keywordList.map(function (key) {
    keywordDataVal[key].value = data[key].defaultValue
    })
      this.debug = keywordDataVal;
  }
/**
 * Purpose : To invoke the service responsible to open Help Notification Dialog 
 * related to the current component.
 */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Advance","Debug Level",this.agentType );
}
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
   // if (this.subscriptionEG)
   //   this.subscriptionEG.unsubscribe();
  }
}
