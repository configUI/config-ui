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
  keywordList = ['bciInstrSessionPct', 'enableCpuTime', 'correlationIDHeader', 'captureMethodForAllFP', 'enableMethodBreakDownTime', 'methodResponseTimeFilter', 'dumpOnlyMethodExitInFP'];
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

  childCpuFp: boolean = false;
  childBrkDown: boolean = false;

  dumpOnlyMethodExitInFP: boolean;
  enableDisableMethodResTimeFilter: boolean;
  slowVerySlowMethodResponseTime: string;
  normalMethodResponseTime: string;
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
        if (this.flowPath['enableCpuTime'].value.includes("%20")) {
          this.cpuTime = this.flowPath['enableCpuTime'].value.substring(0, 1);
          this.childCpuFp = true;
        }
        else {
          this.cpuTime = this.flowPath['enableCpuTime'].value
        }

        if (this.flowPath['enableMethodBreakDownTime'].value.includes("%20")) {
          this.methodBreakDownTime = this.flowPath['enableMethodBreakDownTime'].value.substring(0, 1);
          this.childBrkDown = true;
        }
        else {
          this.methodBreakDownTime = this.flowPath['enableMethodBreakDownTime'].value
        }
        this.correlationIDHeader = this.flowPath['correlationIDHeader'].value;
        // this.methodBreakDownTime = this.flowPath['enableMethodBreakDownTime'].value;
        this.captureMethodForAllFPChk = this.flowPath["captureMethodForAllFP"].value == 0 ? false : true;
        // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
       
        this.dumpOnlyMethodExitInFP = this.flowPath["dumpOnlyMethodExitInFP"].value == 0 ? false : true;
        if (this.flowPath['methodResponseTimeFilter'].value.includes("%20")) {
          var arrResTimeFilter = this.flowPath['methodResponseTimeFilter'].value.split("%20");
          this.enableDisableMethodResTimeFilter = arrResTimeFilter[0] == 0 ? false : true;
          this.normalMethodResponseTime = arrResTimeFilter[1];
          this.slowVerySlowMethodResponseTime = arrResTimeFilter[2];
        }


        this.configKeywordsService.toggleKeywordData();
      });
    }
  }
  enableForcedFPChainSelectItem: SelectItem[];
  enableCpuTimeSelectItem: SelectItem[];
  keywordsData: Keywords;

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false
    if (this.saveDisable || this.isProfilePerm)
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
    else {
      if (this.captureMethodForAllFPChk) {
        this.flowPath["captureMethodForAllFP"].value = 1;
      }
      else {
        this.flowPath["captureMethodForAllFP"].value = 0;
      }
      if (this.cpuTime == "0" || this.childCpuFp == false) {
        this.flowPath['enableCpuTime'].value = this.cpuTime
        this.childCpuFp = false
      }
      else if (this.childCpuFp == true) {
        this.flowPath['enableCpuTime'].value = this.cpuTime + "%201";
      }

      if (this.methodBreakDownTime == "0" || this.childBrkDown == false) {
        this.flowPath['enableMethodBreakDownTime'].value = this.methodBreakDownTime
        this.childBrkDown = false
      }
      else if (this.childBrkDown == true) {
        this.flowPath['enableMethodBreakDownTime'].value = this.methodBreakDownTime + "%201";
      }

      if (this.dumpOnlyMethodExitInFP == true) {
        this.flowPath['dumpOnlyMethodExitInFP'].value = 1;
        var methodResTime = 0;
        if(this.enableDisableMethodResTimeFilter == true)
         methodResTime = 1;
      if(this.enableDisableMethodResTimeFilter)
        this.flowPath['methodResponseTimeFilter'].value = methodResTime + "%20" + this.normalMethodResponseTime + "%20" + this.slowVerySlowMethodResponseTime;
      else
        this.flowPath['methodResponseTimeFilter'].value = "0%201%2020";
      }
      else
      {
        this.flowPath['dumpOnlyMethodExitInFP'].value = 0;
        this.flowPath['methodResponseTimeFilter'].value = "0%201%2020";
      }

    }

    this.keywordData.emit(this.flowPath);
  }

  
  checkFrom(from, to) {
    if (this.normalMethodResponseTime > this.slowVerySlowMethodResponseTime) {
      from.setCustomValidity('Normal Method Response Time value must be smaller than Slow Very Slow Method Response Time value.');
    }
    else if (this.normalMethodResponseTime == this.slowVerySlowMethodResponseTime) {
      from.setCustomValidity('Both Normal Method Response Time and Slow Very Slow Method Response Time values cannot be same.');
    }
    else {
      from.setCustomValidity('');
    }
    to.setCustomValidity('');

  }

  checkTo(from, to) {
    if (this.normalMethodResponseTime > this.slowVerySlowMethodResponseTime) {
      to.setCustomValidity('Slow Very Slow Method Response Time value must be greater than Normal Method Response Time value.');
    }
    else if (this.normalMethodResponseTime == this.slowVerySlowMethodResponseTime) {
      to.setCustomValidity('Both Normal Method Response Time and Slow Very Slow Method Response Time values cannot be same.');
    }
    else {
      to.setCustomValidity('');
    }
    from.setCustomValidity('');
  }


  resetKeywordData() {
    this.flowPath = cloneObject(this.configKeywordsService.keywordData);
    this.methodToSetValues(this.flowPath);
  }
  methodToSetValues(data){
    this.flowPath = data;
    this.correlationIDHeader = this.flowPath["correlationIDHeader"].value;
    if (this.flowPath['enableCpuTime'].value.includes("%20")) {
      this.cpuTime = this.flowPath['enableCpuTime'].value.substring(0, 1);
      this.childCpuFp = true;
    }
    else {
      this.cpuTime = this.flowPath['enableCpuTime'].value;
      this.childCpuFp = false;
    }

    if (this.flowPath['enableMethodBreakDownTime'].value.includes("%20")) {
      this.methodBreakDownTime = this.flowPath['enableMethodBreakDownTime'].value.substring(0, 1);
      this.childBrkDown = true;
    }
    else {
      this.methodBreakDownTime = this.flowPath['enableMethodBreakDownTime'].value;
      this.childBrkDown = false;
    }

    this.excludeMethodOnRespTimeChk = this.flowPath["excludeMethodOnRespTime"].value == 0 ? false : true;
    this.captureMethodForAllFPChk = this.flowPath["captureMethodForAllFP"].value == 0 ? false : true;

    this.dumpOnlyMethodExitInFP = this.flowPath["dumpOnlyMethodExitInFP"].value == 0 ? false : true;
    if (this.flowPath['methodResponseTimeFilter'].value.includes("%20")) {
      var arrResTimeFilter = this.flowPath['methodResponseTimeFilter'].value.split("%20");
      this.enableDisableMethodResTimeFilter = arrResTimeFilter[0] == 0 ? false : true;
      this.normalMethodResponseTime = arrResTimeFilter[1];
      this.slowVerySlowMethodResponseTime = arrResTimeFilter[2];
    }
  }

//To reset keywords to default values
resetKeywordsDataToDefault(){
  let data = cloneObject(this.configKeywordsService.keywordData);
    var keywordDataVal = {}
    keywordDataVal = data
    this.keywordList.map(function (key) {
      keywordDataVal[key].value = data[key].defaultValue
    })
    this.flowPath = keywordDataVal;
    this.methodToSetValues(this.flowPath);
    if(this.agentType == 'NodeJS')
       this.excludeMethodOnRespTimeChk = this.flowPath["excludeMethodOnRespTime"].defaultValue == 0 ? false : true;
}
  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog 
   * related to the current component.
   */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("General","Flowpath",this.agentType );
}
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    // if (this.subscriptionEG)
    //   this.subscriptionEG.unsubscribe();
  }
}
