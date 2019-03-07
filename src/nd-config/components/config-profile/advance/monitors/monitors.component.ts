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
  selector: 'app-monitors',
  templateUrl: './monitors.component.html',
  styleUrls: ['./monitors.component.css']
})
export class MonitorsComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;

  className: string = "MonitorsComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */


  keywordList = ['enableBTMonitor', 'enableBackendMonitor'];
  javaKeywordList = ['enableBTMonitor', 'enableBackendMonitor', 'enableJavaGCMonitor'];
  NodeJSkeywordList = ['enableBTMonitor', 'enableBackendMonitor', 'eventLoopMonitor', 'gcProfiler', 'nodejsCpuProfilingTime', 'nodeAsyncEventMonitor', 'nodeServerMonitor'];
  PhpkeywordList = ['enableBTMonitor', 'enableBackendMonitor'];
  PythonkeywordList = ['enableBTMonitor', 'enableBackendMonitor'];

  /**It stores keyword data for showing in GUI */
  monitor: Object;
  enableBTMonitorChk: boolean;
  enableBackendMonitorChk: boolean;
  eventLoopMonitorChk: boolean;
  gcProfilerChk: boolean;
  nodeAsyncEventMonitorChk: boolean;
  nodeServerMonitorChk: boolean;
  enableJavaGCMonitorChk: boolean;
  agentType: string = "";
  isProfilePerm: boolean;
  subscription: Subscription;
  // subscriptionEG: Subscription;
  // enableGroupKeyword: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.agentType = sessionStorage.getItem("agentType");
  }
  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if (this.saveDisable || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    this.loadKeyWordData();

  }
  loadKeyWordData() {
    if (this.agentType == 'NodeJS') {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.NodeJSkeywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        this.monitor = keywordDataVal;
        this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
        this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
        this.eventLoopMonitorChk = this.monitor["eventLoopMonitor"].value == 0 ? false : true;
        this.gcProfilerChk = this.monitor["gcProfiler"].value == 0 ? false : true;
        this.nodeAsyncEventMonitorChk = this.monitor["nodeAsyncEventMonitor"].value == 0 ? false : true;
        this.nodeServerMonitorChk = this.monitor["nodeServerMonitor"].value == 0 ? false : true;
        console.log(this.className, "constructor", "this.monitors", this.monitor);
        this.configKeywordsService.toggleKeywordData();
      });
    }
    else if (this.agentType == 'Java') {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.javaKeywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })
        this.monitor = keywordDataVal;
        this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
        this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
        this.enableJavaGCMonitorChk = this.monitor["enableJavaGCMonitor"].value == 0 ? false : true;
        this.configKeywordsService.toggleKeywordData();
      });
    }
    //Below two block checks For Php and Python 
    else if(this.agentType == 'Php') {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        let keywordDataVal = {}
        this.PhpkeywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })

        this.monitor = keywordDataVal;
        this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
        this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
        // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
        this.configKeywordsService.toggleKeywordData();
      });
    }
    else if(this.agentType == 'Python') {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        let keywordDataVal = {}
        this.PythonkeywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })

        this.monitor = keywordDataVal;
        this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
        this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
        // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
        this.configKeywordsService.toggleKeywordData();
      });
    }
    else {
      this.subscription = this.store.select("keywordData").subscribe(data => {
        var keywordDataVal = {}
        this.keywordList.map(function (key) {
          keywordDataVal[key] = data[key];
        })

        this.monitor = keywordDataVal;
        this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
        this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
        // this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
        this.configKeywordsService.toggleKeywordData();
      });
    }
  }
  saveKeywordData() {
    if (this.agentType == 'Java') {
      if (this.enableJavaGCMonitorChk) {
        this.monitor["enableJavaGCMonitor"].value = 1;
      }
      else {
        this.monitor["enableJavaGCMonitor"].value = 0;
      }
      if (this.enableBTMonitorChk) {
        this.monitor["enableBTMonitor"].value = 1;
      }
      else {
        this.monitor["enableBTMonitor"].value = 0;
      }
      if (this.enableBackendMonitorChk) {
        this.monitor["enableBackendMonitor"].value = 1;
      }
      else {
        this.monitor["enableBackendMonitor"].value = 0;
      }
    }
    else if (this.agentType == 'NodeJS') {
      if (this.eventLoopMonitorChk) {
        this.monitor["eventLoopMonitor"].value = "1";
      }
      else {
        this.monitor["eventLoopMonitor"].value = 0;
      }
      if (this.nodeAsyncEventMonitorChk) {
        this.monitor["nodeAsyncEventMonitor"].value = 1;
      }
      else {
        this.monitor["nodeAsyncEventMonitor"].value = 0;
      }
      if (this.gcProfilerChk) {
        this.monitor["gcProfiler"].value = 1;
      }
      else {
        this.monitor["gcProfiler"].value = 0;
      }
      if (this.nodeServerMonitorChk) {
        this.monitor["nodeServerMonitor"].value = 1;
      }
      else {
        this.monitor["nodeServerMonitor"].value = 0;
      }
    }

    //Below two blocks is for Php and Python
    else if(this.agentType == 'Php') {
      if (this.enableBTMonitorChk) {
        this.monitor["enableBTMonitor"].value = 1;
      }
      else {
        this.monitor["enableBTMonitor"].value = 0;
      }
      if (this.enableBackendMonitorChk) {
        this.monitor["enableBackendMonitor"].value = 1;
      }
      else {
        this.monitor["enableBackendMonitor"].value = 0;
      }
    }
    else if(this.agentType == 'Python') {
      if (this.enableBTMonitorChk) {
        this.monitor["enableBTMonitor"].value = 1;
      }
      else {
        this.monitor["enableBTMonitor"].value = 0;
      }
      if (this.enableBackendMonitorChk) {
        this.monitor["enableBackendMonitor"].value = 1;
      }
      else {
        this.monitor["enableBackendMonitor"].value = 0;
      }
    }
    else {
      if (this.enableBTMonitorChk) {
        this.monitor["enableBTMonitor"].value = 1;
      }
      else {
        this.monitor["enableBTMonitor"].value = 0;
      }
      if (this.enableBackendMonitorChk) {
        this.monitor["enableBackendMonitor"].value = 1;
      }
      else {
        this.monitor["enableBackendMonitor"].value = 0;
      }
    }
    this.keywordData.emit(this.monitor);
  }

  resetKeywordData() {
    this.getKeyWordDataFromStore();
  }
  getKeyWordDataFromStore() {
    if (this.agentType == 'NodeJS') {
      let data = this.configKeywordsService.keywordData;
      for (let key in data) {
        if (this.NodeJSkeywordList.includes(key)) {
          this.monitor[key].value = data[key].value;
        }
      }
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      this.eventLoopMonitorChk = this.monitor["eventLoopMonitor"].value == 0 ? false : true;
      this.gcProfilerChk = this.monitor["gcProfiler"].value == 0 ? false : true;
      this.nodeAsyncEventMonitorChk = this.monitor["nodeAsyncEventMonitor"].value == 0 ? false : true;
      this.nodeServerMonitorChk = this.monitor["nodeServerMonitor"].value == 0 ? false : true;
      this.configKeywordsService.toggleKeywordData();
    }
    else if (this.agentType == 'Java') {
      let data = this.configKeywordsService.keywordData;
      for (let key in data) {
        if (this.javaKeywordList.includes(key)) {
          this.monitor[key].value = data[key].value;
        }
      }
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      this.enableJavaGCMonitorChk = this.monitor["enableJavaGCMonitor"].value == 0 ? false : true;
      this.configKeywordsService.toggleKeywordData();
    }
    //Below two blocks checks for Agent Type : Php OR Python
    else if(this.agentType == 'Php') {
      let data = this.configKeywordsService.keywordData;
      for (let key in data) {
        if (this.PhpkeywordList.includes(key)) {
          this.monitor[key].value = data[key].value;
        }
      }
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      this.configKeywordsService.toggleKeywordData();
    }
    else if(this.agentType == 'Python') {
      let data = this.configKeywordsService.keywordData;
      for (let key in data) {
        if (this.PythonkeywordList.includes(key)) {
          this.monitor[key].value = data[key].value;
        }
      }
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      this.configKeywordsService.toggleKeywordData();
    }
    else {
      let data = this.configKeywordsService.keywordData;
      for (let key in data) {
        if (this.keywordList.includes(key)) {
          this.monitor[key].value = data[key].value;
        }
      }
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      this.configKeywordsService.toggleKeywordData();
    }
  }
  /* This method is used to reset the keyword data to its Default value */
  resetKeywordsDataToDefault() {
    let data = this.configKeywordsService.keywordData;
    if (this.agentType == "NodeJS") {
      for (let key in data) {
        if (this.NodeJSkeywordList.includes(key)) {
          this.monitor[key].value = data[key].defaultValue;
        }
      }
    }
    else if (this.agentType == 'Java') {
      for (let key in data) {
        if (this.javaKeywordList.includes(key)) {
          this.monitor[key].value = data[key].defaultValue;
        }
      }
    }
    //Below two blocks checks for Agent Type : Php OR Python
    else if(this.agentType == 'Php') {
      for (let key in data) {
        if (this.PhpkeywordList.includes(key)) {
          this.monitor[key].value = data[key].defaultValue;
        }
      }
    }
    else if(this.agentType == 'Python') {
      for (let key in data) {
        if (this.PythonkeywordList.includes(key)) {
          this.monitor[key].value = data[key].defaultValue;
        }
      }
    }
    else {
      for (let key in data) {
        if (this.keywordList.includes(key)) {
          this.monitor[key].value = data[key].defaultValue;
        }
      }
    }
    if (this.agentType == 'NodeJS') {
      this.eventLoopMonitorChk = this.monitor["eventLoopMonitor"].defaultValue == 0 ? false : true;
      this.gcProfilerChk = this.monitor["gcProfiler"].defaultValue == 0 ? false : true;
      this.nodeAsyncEventMonitorChk = this.monitor["nodeAsyncEventMonitor"].defaultValue == 0 ? false : true;
      this.nodeServerMonitorChk = this.monitor["nodeServerMonitor"].defaultValue == 0 ? false : true;
      this.monitor["nodejsCpuProfilingTime"].value = this.monitor["nodejsCpuProfilingTime"].defaultValue;
    }
    else if (this.agentType == 'Java') {
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
      this.enableJavaGCMonitorChk = this.monitor["enableJavaGCMonitor"].value == 0 ? false : true;
    }
    //Below two blocks checks for Agent Type : Php OR Python
    else if(this.agentType == 'Php') {
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
    }
    else if(this.agentType == 'Python') {
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
    }
    else {
      this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
      this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
    }
  }
  /**
   * Purpose : To invoke the service responsible to open Help Notification Dialog 
   * related to the current component.
   */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Advance", "Monitors", this.agentType);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    // if (this.subscriptionEG)
    //   this.subscriptionEG.unsubscribe();
  }

}
