import { Component, OnInit } from '@angular/core';
import {  SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../interfaces/keywords';
import { KeywordsInfo } from '../../../interfaces/keywords-info';
import { ConfigKeywordsDataService } from '../../../services/config-keywords-data.service';
import { ActivatedRoute, Params } from '@angular/router';
//import * as _ from 'lodash';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})

export class GeneralComponent implements OnInit {

  constructor(private keywordsDataService: ConfigKeywordsDataService,private route: ActivatedRoute) { }

  enableForcedFPChainSelectItem:SelectItem[];
  enableCpuTimeSelectItem:SelectItem[];
  keywordsData:Keywords;
 // keywordInfo :KeywordsInfo;


  ngOnInit() {
    console.log("genderal cmp---",this)
    this.loadKeywordsData();
    this.createEnableForcedFPChainSelectItem();
    this.createEnableCpuTimeSelectItem();
  }

  createEnableForcedFPChainSelectItem(){
    this.enableForcedFPChainSelectItem = [];
    this.enableForcedFPChainSelectItem.push( { value: -1, label: '--Select--' },
                                            { value: 0, label: 'Disable' },
                                            { value: 1, label: 'Enable' },
                                            { value: 2, label: 'Enable all with complete FP' }
    );
  
  }
  createEnableCpuTimeSelectItem(){
    this.enableCpuTimeSelectItem = [];
    this.enableCpuTimeSelectItem.push( { value:-1, label: '--Select--' },
                                      { value: 0, label: 'Disable' },
                                      { value: 1, label: 'Enable at FP/ BT level' },
                                      { value: 2, label: 'Enable both method and flowpath level' }
    );
  }

  submitKeywords(data){

    let formData = Object.assign({}, data.form._value); 
    var keywordsData =  Object.assign({}, this.keywordsData);
 
    Object.keys(formData).forEach(function(key) {
      keywordsData[key]['value'] = formData[key];
      formData[key] = keywordsData[key];
    });
    let profileId;
    this.route.params.subscribe((params: Params) => profileId = params['profileId']);
    
    this.keywordsDataService.saveKeywordData(formData,profileId);

  }

   loadKeywordsData(){
    let profileId;
    this.route.params.subscribe((params: Params) => profileId = params['profileId']);
    this.keywordsDataService.getKeywordsData(profileId).subscribe(data =>
      this.keywordsData = data
    )
  
   }

}
