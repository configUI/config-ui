import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { cloneObject } from '../../../../../utils/config-utility';

@Component({
  selector: 'app-thread-stats',
  templateUrl: './thread-stats.component.html',
  styleUrls: ['./thread-stats.component.css']
})
export class ThreadStatsComponent implements OnInit {

  @Input()
  profileId: number;
  @Input()
  saveDisable: boolean;
  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  jvmThreadStats: JVMThreadStats;

  /**These are those keyword which are used in current screen. */;
  keywordList: string[] = ['enableJVMThreadMonitor'];

  /**It stores keyword data for showing in GUI */
  threadStats: Object;
  enableGroupKeyword: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) {
  }

  ngOnInit() {
    this.getKeywordData();
    this.saveDisable=this.profileId==1 ? true:false;
    console.log("hi",this.profileId);
  }

  //method to split enableJVMThreadMonitor keyword value
  threadStatsKeyVal() {
    if ((this.threadStats["enableJVMThreadMonitor"].value).includes("%20")) {
      let arr = (this.threadStats["enableJVMThreadMonitor"].value).split("%20");
      this.jvmThreadStats = new JVMThreadStats();
      this.jvmThreadStats.jvm = arr[0] == 1 ? true : false;
      this.jvmThreadStats.cpu = arr[1];
      // this.jvmThreadStats.deleteVector = arr[2] == 1 ? true : false;

    }
    if (this.threadStats["enableJVMThreadMonitor"].value == 0) {
      this.jvmThreadStats = new JVMThreadStats();
      this.jvmThreadStats.jvm = false;
      this.jvmThreadStats.cpu = null;
      // this.jvmThreadStats.deleteVector = false;
    }
    if (this.threadStats["enableJVMThreadMonitor"].value == 1) {
      this.jvmThreadStats = new JVMThreadStats();
      this.jvmThreadStats.jvm = false;
      this.jvmThreadStats.cpu = null;
      // this.jvmThreadStats.deleteVector = false;
    }
  }

  getKeywordData() {
    let keywordData = this.configKeywordsService.keywordData;
    this.threadStats = {}
    this.keywordList.forEach((key) => {
      if (keywordData.hasOwnProperty(key)) {
        this.threadStats[key] = keywordData[key];
      }
    });
    this.threadStatsKeyVal();
  }

  /*Here the value of this keyword is as:
  * enableJVMMonitor = "1%2040%20%1"
  * Here 1  = enableJVMMonitor
  *      40 = cpuFilter value
  *      1  = donot delete  vector(enabled = 1 /disabled = 0)
  */

  saveKeywordData(data) {
    let threadVal = this.threadValMethod(data);
    for (let key in this.threadStats) {
      if (key == 'enableJVMThreadMonitor')
        this.threadStats[key]["value"] = threadVal;
    }
    this.keywordData.emit(this.threadStats);
  }

//Method to generate enableJVMThreadMonitor keyword value
  threadValMethod(data) {
    if(this.jvmThreadStats.jvm == false){
      let key = 0;
      return key;
    }
    else{
    let key = `${this.jvmThreadStats.jvm == true ? 1 : 0}%20${this.jvmThreadStats.cpu}%20${this.jvmThreadStats.jvm == true ? 1 : 0}`;
    return key;
    }
  }

  resetKeywordData() {
    this.threadStats = cloneObject(this.configKeywordsService.keywordData);
    this.threadStatsKeyVal();

  }
}
class JVMThreadStats {
  jvm;
  cpu;
}
