import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
  selector: 'app-generate-exception',
  templateUrl: './generate-exception.component.html',
  styleUrls: ['./generate-exception.component.css']
})
export class GenerateExceptionComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;

  className: string = "GenerateExceptionComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['generateExceptionInMethod'];
  /**It stores keyword data for showing in GUI */
  genException: Object;
  genExceptionData: GenExceptionData;
  subscription: Subscription;
  subscriptionEG: Subscription;
  exceptionType: SelectItem[];
  enableGroupKeyword: boolean;

  isProfilePerm: boolean;
  // Items to be displayed in Exception Type drop-down menu
  createExceptionTypeSelectType() {
    this.exceptionType = [];
    this.exceptionType.push(
      { value: -1, label: '--Select--' },
      { value: 4, label: 'Arithematic Exception' },
      { value: 2, label: 'Array IndexOutOfBounds Exception' },
      { value: 3, label: 'Class Cast Exception' },
      { value: 5, label: 'Illegal Exception' },
      { value: 1, label: 'Null Pointer Exception' }, );
  }

  /**
   * value for generateExceptionInMethod keyword is 2%20abc%3Baaa%3Baaa%201%20sd
   * 2-percentage
   * abc;aaa;aaa-fqm, ; is replaced by %3B
   * 1- exceptionType value
   * sd-exceptionName
   */

  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>, private configUtilityService: ConfigUtilityService, ) {
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.genException = keywordDataVal;
      console.log(this.className, "constructor", "this.genException", this.genException);
    });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.advance.generate_exception.enable);
    this.configKeywordsService.toggleKeywordData();
  }
  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if(this.saveDisable || !this.enableGroupKeyword || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    this.createExceptionTypeSelectType();
    this.GenExceptionKeywordValue();
  }
  //Method to split the generateExceptionInMethod keyword values by %20 e.g. 2%20abc%3Baaa%3Baaa%201%20sd will be splitted by %20 and %3B
  GenExceptionKeywordValue() {
    if ((this.genException["generateExceptionInMethod"].value).includes("%20")) {
      let arr = (this.genException["generateExceptionInMethod"].value).split("%20")
      this.genExceptionData = new GenExceptionData();
      this.genExceptionData.percentage = arr[0];
      let fqm = arr[1].split("%3B").join(";");
      this.genExceptionData.fullyqualifiedName = fqm;
      this.genExceptionData.exceptionType = arr[2];
      this.genExceptionData.exceptionName = arr[3];
    }

    else {
      this.genExceptionData = new GenExceptionData();
      if (this.genException["generateExceptionInMethod"].value == 0) {
        this.genExceptionData.fullyqualifiedName = null;
        this.genExceptionData.percentage = 0;
        this.genExceptionData.exceptionName = null;
        this.genExceptionData.exceptionType = false;

      }
      if (this.genException["generateExceptionInMethod"].value == 1) {
        this.genExceptionData.fullyqualifiedName = null;
        this.genExceptionData.percentage = 0;
        this.genExceptionData.exceptionName = null;
        this.genExceptionData.exceptionType = false;
      }

    }
  }
  saveKeywordData(data) {
    let genExceptionValue = this.genExceptionValueMethod(data);
    for (let key in this.genException) {
      if (key == 'generateExceptionInMethod')
        this.genException[key]["value"] = genExceptionValue;
    }
    this.keywordData.emit(this.genException);
  }

  resetKeywordData() {
    this.genException = cloneObject(this.configKeywordsService.keywordData);
    this.GenExceptionKeywordValue();
  }

  // Method used to construct the value of generateExceptionInMethod keyword in '2%20abc%3Baaa%3Baaa%201%20sd' form.
  genExceptionValueMethod(data) {

    let fqm = this.genExceptionData.fullyqualifiedName.split(";").join("%3B");
    let genExceptionKeywordVaule = `${this.genExceptionData.percentage}%20${fqm}%20${this.genExceptionData.exceptionType}%20${this.genExceptionData.exceptionName}`;
    return genExceptionKeywordVaule;

  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.subscriptionEG)
      this.subscriptionEG.unsubscribe();
  }
}
//Contains generateExceptionInMethod Keyword variables
class GenExceptionData {
  fullyqualifiedName: string;
  percentage: number;
  exceptionType;
  exceptionName: string;
}
