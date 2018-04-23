
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

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
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
  isInstrProfileBrowse: boolean = false;
  isProfilePerm: boolean;
  agentType: string = ""; 
  arr: any = [];

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>,private confirmationService: ConfirmationService
  ) {
     this.agentType = sessionStorage.getItem("agentType");
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
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    if(this.saveDisable || !this.enableGroupKeyword || this.isProfilePerm)
      this.configUtilityService.infoMessage("Reset and Save are disabled");
    this.loadListOfXmlFiles();
    //let path = "C:\\Users\\compass-357\\Desktop\\Autodiscover\\fileReader.txt"
    this.configKeywordsService.fileListProvider.subscribe(data => {
      this.browseXmlFiles(data);
    });
  }

  /** This method is used to creating instrProfile select item object **/
  createInstrProfileSelectItem(list) {
    this.instrProfileSelectItem = [];
   /* let tempList = list;
    for (let i = 0; i < tempList.length; i++) {
      let temp:string[];
      temp = tempList[i].split(".")
      this.arr.push(temp[0])
    }
*/
    for (let i = 0; i < list.length; i++) {
      let labelname:string;
      labelname=list[i].split(".")[0];
      this.instrProfileSelectItem.push({ value: list[i], label: labelname });
    }
    this.loadInstrData();
  }

  loadListOfXmlFiles() {
    this.configKeywordsService.getListOfXmlFiles(this.profileId, this.agentType).subscribe(data => {
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
//    if(value[0]==null || value[0]==""){
//    this.configUtilityService.infoMessage("Please select file(s)");
//    return;
//    }
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
    this.isInstrProfileBrowse = true;
    this.openFileExplorerDialog = true;

  }

  //Method to get the xml file path and upload them
  browseXmlFiles(filesWithPath) {
   if (this.isInstrProfileBrowse == true) {
     this.isInstrProfileBrowse = false;
     this.openFileExplorerDialog = false;

    // Finding duplicate entry
    let deepFilePathCopy = filesWithPath;
    let fileList = filesWithPath.split(";");
    var files = [];
    for (let i = 0; i < fileList.length ; i++) {
      let found = false;
      let fileName = fileList[i].substring(fileList[i].lastIndexOf("/") + 1, fileList[i].length);
      for (let j = 0 ; j < this.instrProfileSelectItem.length ; j++) {
        if(fileName.trim() === this.instrProfileSelectItem[j].label) {
          found = true;
          break;
        }
      }
      if(!found)
        files.push(fileList[i]);
    }
    filesWithPath = files.join(";");

    if(deepFilePathCopy.split(";").length != files.length)
    {
	this.confirmationService.confirm({
          message: 'Selection contains already added files. Are you sure that you want to upload unique files?',	
          header: 'Confirmation',
          icon: 'fa fa-question-circle',
          accept: () => {
		filesWithPath = filesWithPath + "%" + this.agentType
		// let filesWith = "C:/Users/compass-165/Documents/xmlfiles/xmlfile1.txt;C:/Users/compass-165/Documents/xmlfiles/2.xml;C:/Users/compass-165/Documents/xmlfiles/3.xml";
		if(files.length != 0) {
    		  this.configKeywordsService.copyXmlFiles(filesWithPath, this.profileId).subscribe(data => {
                     this.loadListOfXmlFiles();
      		    if (data.length < 1) {
        	      this.configUtilityService.successMessage("Files imported successfully");
      		    }
      		    else
        	      this.configUtilityService.infoMessage("Could not import these files -" + data + ". Files may be corrupted or contains invalid data");
    		  },
      		  error => {
        	    console.log("Error in browsing xml files");
      		  }); 
		} else {
		  this.configUtilityService.errorMessage("All Selected files are already imported");
	 	}	
           }
       	});	
     } else {
    	 filesWithPath = filesWithPath + "%" + this.agentType
         this.configKeywordsService.copyXmlFiles(filesWithPath, this.profileId).subscribe(data => {
         this.loadListOfXmlFiles();
           if (data.length < 1) {
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
  }
 /* change Browse boolean value on change component */
 ngOnDestroy() {
   this.isInstrProfileBrowse = false;
 }
}
