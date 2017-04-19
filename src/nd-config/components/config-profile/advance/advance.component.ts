import { Component, OnInit } from '@angular/core';
import {  SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../interfaces/keywords';
import { KeywordsInfo } from '../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigKeywordsService } from '../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import { Messages } from '../../../constants/config-constant'

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {


  profileId: number;
  index: number = 0;

  constructor(private configKeywordsService: ConfigKeywordsService,  private configUtilityService: ConfigUtilityService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      this.index = params['tabId'];
    });
    this.loadKeywordData();
  }
  /**This method is used to when keyword data object doesn't exists any key value then we will get keyword data from server */
  loadKeywordData(){
    if(!this.configKeywordsService.keywordData)
      this.configKeywordsService.getProfileKeywords(this.profileId);
  }

  saveKeywordData(keywordData){
    for(let key in keywordData){
      this.configKeywordsService.keywordData[key] = keywordData[key];
    }
    this.configUtilityService.successMessage(Messages);
    this.configKeywordsService.saveProfileKeywords(this.profileId);

  }

  handleChange(e){
    this.index = e.index;
  }

}
