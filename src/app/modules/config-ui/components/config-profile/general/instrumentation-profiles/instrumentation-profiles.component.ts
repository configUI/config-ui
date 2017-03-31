
import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { SelectItem } from 'primeng/primeng';
//import { XmlFilesList } from '../../../../interfaces/keywords-info';

@Component({
  selector: 'app-instrumentation-profiles',
  templateUrl: './instrumentation-profiles.component.html',
  styleUrls: ['./instrumentation-profiles.component.css']
})

export class InstrumentationProfilesComponent implements OnInit {

  constructor(private configKeywordsService: ConfigKeywordsService) { }


  //Here profileId is used for fetching list of xml files
  @Input()
  profileId: number;

  @Output()
  keywordData = new EventEmitter();

  /**  stores xmlFilesList **/
  xmlFilesList :string[]

  /** SelectItem for instrProfiles */
  instrProfileSelectItem: SelectItem[];

  ngOnInit() {
    // this.loadListOfXmlFiles()
  }

 /** This method is used to creating instrProfile select item object **/
  createInstrProfileSelectItem(list) {
    this.instrProfileSelectItem = [];
    for (let i = 0; i < list.length; i++) {
      this.instrProfileSelectItem.push({ value: list[i], label: list[i] });
    }
  }



  loadListOfXmlFiles(){
     this.configKeywordsService.getListOfXmlFiles(this.profileId).subscribe(data =>{ this.createInstrProfileSelectItem(data)});
  }


  saveKeywordData(data){
    let value = data.form._value.instrProfiles
    let keywordData = this.configKeywordsService.keywordData;
    let keyword = {}
    if(keywordData.hasOwnProperty("instrProfile")){
        keyword["instrProfile"] = keywordData["instrProfile"];
    }
    for(let key in keyword){
      keyword[key]["value"] = String(value);
    }
    this.keywordData.emit(keyword)
  }
}
