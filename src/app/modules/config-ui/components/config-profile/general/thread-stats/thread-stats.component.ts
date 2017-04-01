import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';

@Component({
  selector: 'app-thread-stats',
  templateUrl: './thread-stats.component.html',
  styleUrls: ['./thread-stats.component.css']
})
export class ThreadStatsComponent implements OnInit {


  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['enableJVMThreadMonitor'];

  /**It stores keyword data for showing in GUI */
  threadStats: Object;

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.getKeywordData();
  }

  getKeywordData() {
    let keywordData = this.configKeywordsService.keywordData;
    this.threadStats = {}


    this.keywordList.forEach((key) => {
      if (keywordData.hasOwnProperty(key)) {
        this.threadStats[key] = keywordData[key];
      }
    });
  }

  /*Here the value of this keyword is as:
  * enableJVMMonitor = "1%2040%20%1"
  * Here 1  = enableJVMMonitor
  *      40 = cpuFilter value
  *      1  = donot delete  vector(enabled = 1 /disabled = 0)
  */

  saveKeywordData(data) {
    let formData = Object.assign({}, data.form._value)
    let jvmVal;
    if (!(formData.enableJVMMonitor))
      jvmVal = "0";
    else
      jvmVal = "1%20" + formData.cpuFilter;

    if (!(formData.doNotDelVector))
      jvmVal = jvmVal + "%200";
    else
      jvmVal = jvmVal + "%201";

    for (let key in this.threadStats) {
      if (key == 'enableJVMThreadMonitor')
        this.threadStats[key]["value"] = jvmVal
    }
    //this.threadStats.enableJVMThreadMonitor["value"] = jvmVal;
    this.keywordData.emit(this.threadStats);
  }
}
