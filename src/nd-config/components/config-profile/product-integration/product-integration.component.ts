import { Component, OnInit } from '@angular/core';
import {  SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../interfaces/keywords';
import { KeywordsInfo } from '../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigKeywordsService } from '../../../services/config-keywords.service';

@Component({
  selector: 'app-product-integration',
  templateUrl: './product-integration.component.html',
  styleUrls: ['./product-integration.component.css']
})
export class ProductIntegrationComponent implements OnInit {

   profileId: number;
  index: number = 0;

  constructor(private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute) { }

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
    this.configKeywordsService.saveProfileKeywords(this.profileId);
  }

  handleChange(e){
    this.index = e.index;
  }

}