import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KeywordData } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.css']
})
export class HotspotComponent implements OnInit {

  /**This is to send data to parent component(General Screen Component) for save keyword data */
  @Output()
  keywordData = new EventEmitter();

  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['ASSampleInterval', 'ASThresholdMatchCount', 'ASReportInterval', 'ASDepthFilter', 'ASTraceLevel', 'ASStackComparingDepth'];

  /**It stores keyword data for showing in GUI */
  hotspot: Object;

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.getKeywordData();
  }

  getKeywordData(){
    let keywordData = this.configKeywordsService.keywordData;
    this.hotspot = {};

    this.keywordList.forEach((key)=>{
      if(keywordData.hasOwnProperty(key)){
        this.hotspot[key] = keywordData[key];
      }
    });
  }
  
  saveKeywordData(){
    this.keywordData.emit(this.hotspot);
  }

}
