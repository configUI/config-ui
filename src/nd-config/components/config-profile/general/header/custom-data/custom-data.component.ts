import { Component, OnInit, Output, EventEmitter, OnDestroy ,Input} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';

import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { cloneObject } from '../../../../../utils/config-utility';


@Component({
  selector: 'app-custom-data',
  templateUrl: './custom-data.component.html',
  styleUrls: ['./custom-data.component.css']
})
export class CustomDataComponent implements OnInit {

  @Input() data;
  subscription: Subscription;
  header:Object;

 saveDisable: boolean = false;
  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<Object>) {

  }

  ngOnInit() {


  }

}
