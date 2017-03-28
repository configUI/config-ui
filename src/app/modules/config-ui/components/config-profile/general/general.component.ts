import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigKeywordsService } from '../../../services/config-keywords.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  profileId: number;

  constructor(private configKeywordsService: ConfigKeywordsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.profileId = params['profileId'] );
  }

  saveKeywordData(keywordData){
    console.log("keywordData", keywordData);
    for(let key in keywordData){
      this.configKeywordsService.keywordData[key] = keywordData[key];
    }
    console.log("this.configKeywordsService.keywordData", this.configKeywordsService.keywordData);
    this.configKeywordsService.saveProfileKeywords(this.profileId);
  }

}
