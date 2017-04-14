import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-generate-exception',
  templateUrl: './generate-exception.component.html',
  styleUrls: ['./generate-exception.component.css']
})
export class GenerateExceptionComponent implements OnInit {
  @Output()
  keywordData = new EventEmitter();

  className: string = "GenerateExceptionComponent";
  keywordsData: Keywords;
  /**These are those keyword which are used in current screen. */
  keywordList: string[] = ['generateExceptionInMethod'];
  /**It stores keyword data for showing in GUI */
  genException: Object;
  genExceptionData: GenExceptionData;
  subscription: Subscription;
  exceptionType: SelectItem[];
  enableGroupKeyword: boolean;
  // Items to be displayed in Exception Type drop-down menu
  createExceptionTypeSelectType() {
    this.exceptionType = [];
    this.exceptionType.push(
      { value: -1, label: '--Select--' },
      { value: 1, label: 'Null Pointer Exception' },
      { value: 2, label: 'Array IndexOutOfBounds Exception' },
      { value: 3, label: 'Class Cast Exception' },
      { value: 4, label: 'Arithematic Exception' },
      { value: 5, label: 'Illegal Exception' });

  }
  constructor(private configKeywordsService: ConfigKeywordsService, private store: Store<KeywordList>) {
    this.subscription = this.store.select("keywordData").subscribe(data => {
      this.genException = data;
      console.log(this.className, "constructor", "this.genException", this.genException);
    });
    this.enableGroupKeyword = this.configKeywordsService.keywordGroup.advance.generate_exception.enable;
  }
  ngOnInit() {
    this.createExceptionTypeSelectType();
    this.GenExceptionKeywordValue();
  }
  //Method to split the generateExceptionInMethod keyword values by %20 e.g. 2%20abc%3Baaa%3Baaa%201%20sd will be splitted by %20 and %3B
  GenExceptionKeywordValue() {
    console.log("this.genException", this.genException);
    if ((this.genException["generateExceptionInMethod"].value).includes("%20")) {
      let arr = (this.genException["generateExceptionInMethod"].value).split("%20")
      this.genExceptionData = new GenExceptionData();
      this.genExceptionData.percentage = arr[0];
      let fqm = arr[1].split("%3B").join(";");
      this.genExceptionData.fullyQaulifiedName = fqm;
      this.genExceptionData.exceptionType = arr[2];
      this.genExceptionData.exceptionName = arr[3];
    }

    else {
      this.genExceptionData = new GenExceptionData();
      if (this.genException["generateExceptionInMethod"].value == 0) {
        this.genExceptionData.fullyQaulifiedName = null;
        this.genExceptionData.percentage = 0;
        this.genExceptionData.exceptionName = null;
        this.genExceptionData.exceptionType = false;

      }
      if (this.genException["generateExceptionInMethod"].value == 1) {
        this.genExceptionData.fullyQaulifiedName = null;
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
  // Method used to construct the value of generateExceptionInMethod keyword in '2%20abc%3Baaa%3Baaa%201%20sd' form.
  genExceptionValueMethod(data) {

    let fqm = this.genExceptionData.fullyQaulifiedName.split(";").join("%3B");
    let genExceptionKeywordVaule = `${this.genExceptionData.percentage}%20${fqm}%20${this.genExceptionData.exceptionType}%20${this.genExceptionData.exceptionName}`;
    return genExceptionKeywordVaule;

  }

  ngOnDestroy() {

  }
}
//Contains generateExceptionInMethod Keyword variables 
class GenExceptionData {
  fullyQaulifiedName: string;
  percentage: number;
  exceptionType;
  exceptionName: string;
}
