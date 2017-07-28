import { Component, OnInit, OnChanges } from '@angular/core';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUiUtility } from '../../utils/config-utility';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { Messages } from '../../constants/config-constant';

@Component({
  selector: 'app-config-import-instr-profile',
  templateUrl: './config-import-instr-profile.component.html',
  styleUrls: ['./config-import-instr-profile.component.css']
})
export class ConfigImportInstrProfileComponent implements OnInit {

  constructor(private _configKeywordsService: ConfigKeywordsService, private _configUtilityService: ConfigUtilityService) { }

  xmlFormat: any;
  profileXMLFileList: any[];
  selectedXMLFile: string;
  isMakeXMLFile: boolean;
  openFileExplorerDialog: boolean = false;
  userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");
  ngOnInit() {

    /* create Dropdown for xml files */
    this.createDropDown("filename");
    this.xmlFormat = "No file selected";

    this._configKeywordsService.fileListProvider.subscribe(data => {
      this.getFileList(data);
    });
  }

  createDropDown(filename) {
    this._configKeywordsService.getInstrumentationProfileXMLFileList().subscribe(data => {
      this.profileXMLFileList = ConfigUiUtility.createDropdown(data);
      if (filename !== "filename")
        this.selectedXMLFile = filename;
    });
  }

  /**used to open file manager */
  openFileManager() {
    this.openFileExplorerDialog = true;
    this.isMakeXMLFile = true;
  }

  /* this method is used for get xml data  on selected a text file from file manager*/
  getFileList(path) {
    if (path.includes(";")) {
      this._configUtilityService.errorMessage("Multiple files cannot be imported");
      return;
    }
     if(!path.includes(".txt"))
      {
       this._configUtilityService.errorMessage("File extension not matched (i.e .txt)");
         return;
      }
    if (this.isMakeXMLFile == true) {
      this.isMakeXMLFile = false;
      let filename = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))
      filename = filename + ".xml";
      path = path + "@" + this.userName;
      this._configKeywordsService.getInstrumentationProfileXMLData(path).subscribe(data => {
        // const xml = beautify(data._body);
        this.xmlFormat = data._body;
        this._configUtilityService.successMessage("File imported successfully");
        this.createDropDown(filename);
      });
    }

    this.openFileExplorerDialog = false;
  }

  /* this method is used for get xml data  on selected a xml file from dropdown*/
  showSelectedXmlFileData() {
    if (this.selectedXMLFile === undefined || this.selectedXMLFile === "") {
      this._configUtilityService.errorMessage("Select a file to View");
      return;
    }
    this._configKeywordsService.getXMLDataFromSelectedXMLFile(this.selectedXMLFile).subscribe(data => {
      // const xml = beautify(data._body);
      this.xmlFormat = data._body;
   });
  }

  /* this method is used for remove xml data from gui*/
  clearWindow() {
    this.xmlFormat = "";
     this.xmlFormat = "No file selected";
      this.selectedXMLFile = "";
  }
}
                                  