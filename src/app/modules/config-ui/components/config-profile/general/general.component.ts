import { Component, OnInit } from '@angular/core';
import {  SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../interfaces/keywords';
import { KeywordsInfo } from '../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ActivatedRoute, Params } from '@angular/router';
//import * as _ from 'lodash';


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
    for(let key in keywordData){
      this.configKeywordsService.keywordData[key] = keywordData[key];
    }
    this.configKeywordsService.saveProfileKeywords(this.profileId);
  }



}
