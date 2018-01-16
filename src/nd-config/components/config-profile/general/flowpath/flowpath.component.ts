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


  //NodeJS keyword- excludeMethodOnRespTime
  keywordList = ['bciInstrSessionPct', 'enableCpuTime', 'correlationIDHeader', 'captureMethodForAllFP', 'enableMethodBreakDownTime'];
  NodeJSkeywordList = ['bciInstrSessionPct', 'correlationIDHeader', 'excludeMethodOnRespTime'];

  flowPath: Object;
  cpuTime: string = '1';
  methodBreakDownTime: string = '1';

  agentType: string = "";
  isProfilePerm: boolean;
  subscription: Subscription;
  // subscriptionEG: Subscription;
  //enableGroupKeyword: boolean = false;
  excludeMethodOnRespTimeChk: boolean;
  // enableCaptureHeader: boolean = false;
  correlationIDHeader: any;
  captureMethodForAllFPChk: boolean;


  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<Object>) {
    this.agentType = sessionStorage.getItem("agentType");
    if (this.agentType == 'NodeJS') {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.NodeJSkeywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })

        this.flowPath = keywordDataVal;
        this.correlationIDHeader = this.flowPath['correlationIDHeader'].value;
        this.excludeMethodOnRespTimeChk = this.flowPath["excludeMethodOnRespTime"].value == 0 ? false : true;
        // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.flowpath.enable);
        this.configKeywordsService.toggleKeywordData();
      });
    }
    else {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })

        this.flowPath = keywordDataVal;
        this.cpuTime = this.flowPath['enableCpuTime'].value;
        this.correlationIDHeader = this.flowPath['correlationIDHeader'].value;
        this.methodBreakDownTime = this.flowPath['enableMethodBreakDownTime'].value;
        this.captureMethodForAllFPChk = this.flowPath["captureMethodForAllFP"].value == 0 ? false : true;
        // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
        this.configKeywordsService.toggleKeywordData();
      });
    }
  }
  enableForcedFPChainSelectItem: SelectItem[];
  enableCpuTimeSelectItem: SelectItem[];
  keywordsData: Keywords;

  ngOnInit() {
  this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false
  if(this.saveDisable || this.isProfilePerm)
    this.configUtilityService.infoMessage("Reset and Save are disabled");
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
    if (this.agentType == 'NodeJS') {
      if (this.excludeMethodOnRespTimeChk) {
        this.flowPath["excludeMethodOnRespTime"].value = 1;
      }
      else {
        this.flowPath["excludeMethodOnRespTime"].value = 0;
      }
      sessionStorage.setItem("excludeMethodOnRespTime", String(this.flowPath["excludeMethodOnRespTime"].value));
    }
    else{
      if (this.captureMethodForAllFPChk) {
        this.flowPath["captureMethodForAllFP"].value = 1;
      }
      else {
        this.flowPath["captureMethodForAllFP"].value = 0;
      }
      this.flowPath['enableCpuTime'].value = this.cpuTime;
      this.flowPath['enableMethodBreakDownTime'].value = this.methodBreakDownTime;
    }


    this.keywordData.emit(this.flowPath);
  }

  resetKeywordData() {
    this.flowPath = cloneObject(this.configKeywordsService.keywordData);
    this.correlationIDHeader = this.flowPath["correlationIDHeader"].value;
    this.cpuTime = this.flowPath['enableCpuTime'].value;
    this.methodBreakDownTime = this.flowPath['enableMethodBreakDownTime'].value;
    this.excludeMethodOnRespTimeChk = this.flowPath["excludeMethodOnRespTime"].value == 0 ? false : true;
    this.captureMethodForAllFPChk = this.flowPath["captureMethodForAllFP"].value == 0 ? false : true;
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    // if (this.subscriptionEG)
    //   this.subscriptionEG.unsubscribe();
  }
}
