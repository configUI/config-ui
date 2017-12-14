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


  //NodeJS keywords- 'eventLoopMonitor', 'gcProfiler', 'nodejsCpuProfilingTime', 'nodeAsyncEventMonitor', 'nodeServerMonitor'
  keywordList = ['enableBTMonitor', 'enableBackendMonitor'];
  NodeJSkeywordList = ['enableBTMonitor', 'enableBackendMonitor', 'eventLoopMonitor', 'gcProfiler', 'nodejsCpuProfilingTime', 'nodeAsyncEventMonitor', 'nodeServerMonitor'];

  /**It stores keyword data for showing in GUI */
  monitor: Object;
  enableBTMonitorChk: boolean;
  enableBackendMonitorChk: boolean;
  eventLoopMonitorChk: boolean;
  gcProfilerChk: boolean;
  nodeAsyncEventMonitorChk: boolean;
  nodeServerMonitorChk: boolean;
  agentType: string = "";
  isProfilePerm: boolean;

  subscription: Subscription;
  subscriptionEG: Subscription;
  enableGroupKeyword: boolean;
  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
    this.agentType = sessionStorage.getItem("agentType");
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
        this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
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
        this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.monitors.enable);
        this.configKeywordsService.toggleKeywordData();
      });
    }
  }
  saveKeywordData() {

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
    if (this.agentType == 'NodeJS') {
      if (this.eventLoopMonitorChk) {
        this.monitor["eventLoopMonitor"].value = 1;
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
      sessionStorage.setItem("eventLoopMonitor", String(this.monitor["eventLoopMonitor"].value));
      sessionStorage.setItem("gcProfiler", String(this.monitor["gcProfiler"].value));
      sessionStorage.setItem("nodeAsyncEventMonitor", String(this.monitor["nodeAsyncEventMonitor"].value));
      sessionStorage.setItem("nodeServerMonitor", String(this.monitor["nodeServerMonitor"].value));
    }
    this.keywordData.emit(this.monitor);
    sessionStorage.setItem("enableBTMonitor", String(this.monitor["enableBTMonitor"].value));
    sessionStorage.setItem("enableBackendMonitor", String(this.monitor["enableBackendMonitor"].value));
  }

  resetKeywordData() {
    this.monitor = cloneObject(this.configKeywordsService.keywordData);
    this.enableBackendMonitorChk = this.monitor["enableBackendMonitor"].value == 0 ? false : true;
    this.enableBTMonitorChk = this.monitor["enableBTMonitor"].value == 0 ? false : true;
    this.eventLoopMonitorChk = this.monitor["eventLoopMonitor"].value == 0 ? false : true;
    this.gcProfilerChk = this.monitor["gcProfiler"].value == 0 ? false : true;
    this.nodeAsyncEventMonitorChk = this.monitor["nodeAsyncEventMonitor"].value == 0 ? false : true;
    this.nodeServerMonitorChk = this.monitor["nodeServerMonitor"].value == 0 ? false : true;
    //  this.backend = cloneObject(this.configKeywordsService.keywordData);

  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionEG)
      this.subscriptionEG.unsubscribe();
  }
  ngOnInit() {
     this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
     if(this.saveDisable || !this.enableGroupKeyword || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
  }

}
