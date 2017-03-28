import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KeywordData } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';

class Hotspot {
  ASSampleInterval: KeywordData;
  ASStackComparingDepth: KeywordData;
  ASReportInterval: KeywordData;
  ASTraceLevel: KeywordData;
  ASThresholdMatchCount: KeywordData;
  ASDepthFilter: KeywordData;
}

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.css']
})
export class HotspotComponent implements OnInit {

  @Output()
  keywordData = new EventEmitter();

  hotspotCapturingDialog: boolean;

  keywordList = ['ASSampleInterval', 'ASThresholdMatchCount', 'ASReportInterval', 'ASDepthFilter', 'ASTraceLevel', 'ASStackComparingDepth'];

  hotspot: Hotspot = new Hotspot();

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.getKeywordData();
  }

  getKeywordData(){
    let keywordData = this.configKeywordsService.keywordData;
    
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
