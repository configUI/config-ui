
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { SelectItem } from 'primeng/primeng';
import { Keywords } from '../../../../interfaces/keywords';
import { KeywordsInfo } from '../../../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
//import { XmlFilesList } from '../../../../interfaces/keywords-info';
import { cloneObject } from '../../../../utils/config-utility';


@Component({
  selector: 'app-instrumentation-profiles',
  templateUrl: './instrumentation-profiles.component.html',
  styleUrls: ['./instrumentation-profiles.component.css']
})

export class InstrumentationProfilesComponent implements OnInit {
  enableGroupKeyword: boolean;
  //Here profileId is used for fetching list of xml files
  @Input()
  profileId: number;


  @Input()
  saveDisable: boolean;

  @Output()
  keywordData = new EventEmitter();

  /**  stores xmlFilesList **/
  xmlFilesList: Object;

  /** SelectItem for instrProfiles */
  instrProfileSelectItem: SelectItem[];
  instrProfiles: any = [];
  subscription: Subscription;
  subscriptionEG: Subscription;
  openFileExplorerDialog: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>,
  ) {
    // this.subscription = this.store.select("keywordData").subscribe(data => {
    //   this.instrProfiles = data;
    //   console.log( "constructor", "this.debug", this.instrProfiles);
    // });
    this.subscriptionEG = this.configKeywordsService.keywordGroupProvider$.subscribe(data => this.enableGroupKeyword = data.general.instrumentation_profiles.enable);
    this.configKeywordsService.toggleKeywordData();
  }

  /**
   * value for instrProfile keyword is
   * abc.xml,exception.xml
   */

  ngOnInit() {
    this.loadListOfXmlFiles();
    //let path = "C:\\Users\\compass-357\\Desktop\\Autodiscover\\fileReader.txt"
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.browseXmlFiles(data);
    });
  }

  /** This method is used to creating instrProfile select item object **/
  createInstrProfileSelectItem(list) {
    this.instrProfileSelectItem = [];
    for (let i = 0; i < list.length; i++) {
      this.instrProfileSelectItem.push({ value: list[i], label: list[i] });
    }
    this.loadInstrData();
  }

  loadListOfXmlFiles() {
    this.configKeywordsService.getListOfXmlFiles(this.profileId).subscribe(data => {
      this.createInstrProfileSelectItem(data)
    },
      error => {
        console.log("error getting xml files");
      });

  }

  //It will load the saved list of instrument Profiles
  loadInstrData() {
    if ((this.configKeywordsService.keywordData["instrProfile"].value)){
      if ((this.configKeywordsService.keywordData["instrProfile"].value).includes(",")){
      let arrVal = (this.configKeywordsService.keywordData["instrProfile"].value).split(",");
      this.instrProfiles = arrVal;
      }
    else{
      let arr = [];
      arr[0]=this.configKeywordsService.keywordData["instrProfile"].value
      this.instrProfiles = arr;
    }
    }
  }

  saveKeywordData(data) {
    let value = this.instrProfiles;
    if(value[0]==null || value[0]==""){
      this.configUtilityService.infoMessage("Please select file(s)");
      return;
    }
    let keywordData = this.configKeywordsService.keywordData;
    let keyword = {}
    if (keywordData.hasOwnProperty("instrProfile")) {
      keyword["instrProfile"] = keywordData["instrProfile"];
    }
    for (let key in keyword) {
      keyword[key]["value"] = String(value);
    }
    this.instrProfiles = value;
    this.keywordData.emit(keyword);
  }

  resetKeywordData() {

    this.xmlFilesList = cloneObject(this.configKeywordsService.keywordData);
    if (this.xmlFilesList["instrProfile"].value == "0" || this.xmlFilesList["instrProfile"].value == "") {
      this.instrProfiles = [];
    }
    this.loadListOfXmlFiles();
  }

  /**used to open file manager
  */
  openFileManager() {

    this.openFileExplorerDialog = true;

  }

  //Method to get the xml file path and upload them
  browseXmlFiles(filesWithPath) {
    this.openFileExplorerDialog = false;
    // let filesWith = "C:/Users/compass-165/Documents/xmlfiles/xmlfile1.txt;C:/Users/compass-165/Documents/xmlfiles/2.xml;C:/Users/compass-165/Documents/xmlfiles/3.xml";
    this.configKeywordsService.copyXmlFiles(filesWithPath, this.profileId).subscribe(data => {
      if (data.length < 1) {
	console.log('Getting Data ==============', data);
        console.log("Items in data =======================", this.instrProfileSelectItem);
        this.configUtilityService.successMessage("Files imported successfully");
      }
      else
        this.configUtilityService.infoMessage("Could not import these files -" + data + ". Files may be corrupted or contains invalid data");
    },
      error => {
        console.log("Error in browsing xml files");
      });
  }

}
