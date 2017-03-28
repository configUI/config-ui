import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfigKeywordsService } from '../../../services/config-keywords.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService) { }

  profileId: number;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.profileId = params['profileId'] );
    this.loadKeywordData();
  }

  loadKeywordData(){
    this.configKeywordsService.getProfileKeywords(this.profileId);
  }

}
