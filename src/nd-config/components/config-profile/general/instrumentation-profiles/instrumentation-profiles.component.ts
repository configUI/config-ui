
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
  isInstrBrowse: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
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
        console.error("Error in getting xml files");
      });

  }

  //It will load the saved list of instrument Profiles
  loadInstrData() {
    if ((this.configKeywordsService.keywordData["instrProfile"].value).includes(",")) {
      let arrVal = (this.configKeywordsService.keywordData["instrProfile"].value).split(",");
      this.instrProfiles = arrVal;
    }
  }

  saveKeywordData(data) {
    let value = this.instrProfiles;
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
    this.isInstrBrowse = true;

  }

  //Method to get the xml file path and upload them
  browseXmlFiles(filesWithPath) {
    if (this.isInstrBrowse == true) {
      this.isInstrBrowse = false;
      this.openFileExplorerDialog = false;
      // let filesWithPath = "";
      this.configKeywordsService.copyXmlFiles(filesWithPath, this.profileId).subscribe(data => {
        if (data.length < 1) {
          this.configUtilityService.successMessage("Files imported successfully");
        }
        else
          this.configUtilityService.infoMessage("Could not import these files -" + data + ". Files may be corrupted or contains invalid data");

        this.loadListOfXmlFiles();
      },
        error => {
          console.error("Error in browsing xml files");
        }
      );
    }
  }


}
