import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-flowpath',
  templateUrl: './flowpath.component.html',
  styleUrls: ['./flowpath.component.css']
})

export class FlowpathComponent implements OnInit, OnDestroy {

  @Output()
  keywordData = new EventEmitter();

  keywordList = ['bciInstrSessionPct', 'enableCpuTime', 'enableForcedFPChain', 'correlationIDHeader'];

  flowPath: Object;

  subscription: Subscription;
  enableGroupKeyword: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<Object>) {
    this.subscription = this.store.select("keywordData").subscribe(data=>{
      this.flowPath = data;
    });

    this.enableGroupKeyword = this.configKeywordsService.keywordGroup.general.flowpath.enable;
   }

  enableForcedFPChainSelectItem: SelectItem[];
  enableCpuTimeSelectItem: SelectItem[];
  keywordsData: Keywords;


  ngOnInit() {
    //this.getKeywordData();
    this.createEnableForcedFPChainSelectItem();
    this.createEnableCpuTimeSelectItem();
  }

  getKeywordData() {
    // let keywordData = this.configKeywordsService.keywordData;
    // this.flowPath = {}
    // this.keywordList.forEach((key)=>{
    //   if(keywordData.hasOwnProperty(key)){
    //     this.flowPath[key] = keywordData[key];
    //   }
    // });
  }

  /* creating dropdown menu list for enableForcedFpchain keyword */
  createEnableForcedFPChainSelectItem() {
    this.enableForcedFPChainSelectItem = [];
    this.enableForcedFPChainSelectItem.push({ value: -1, label: '--Select--' },
      { value: 0, label: 'Disable' },
      { value: 1, label: 'Enable' },
      { value: 2, label: 'Enable all with complete FP' }
    );
  }

  /* creating dropdown menu list for enableCpuTime */
  createEnableCpuTimeSelectItem() {
    this.enableCpuTimeSelectItem = [];
    this.enableCpuTimeSelectItem.push({ value: '-1', label: '--Select--' },
      { value: '0', label: 'Disable' },
      { value: '1', label: 'Enable at FP/ BT level' },
      { value: '2', label: 'Enable both method and flowpath level' }
    );
  }

  saveKeywordData() {
    this.keywordData.emit(this.flowPath);
  }

   resetKeywordData(){
     this.flowPath = cloneObject(this.configKeywordsService.keywordData);
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}

