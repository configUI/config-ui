import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigProfileService } from '../../services/config-profile.service'
import { ConfigKeywordsService } from '../../services/config-keywords.service';
//  import { ProfileInfo } from '../../interfaces/profile-info';
import { ProfileData } from '../../containers/profile-data';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ImmutableArray } from '../../utils/immutable-array';
import { Messages, descMsg , addMessage } from '../../constants/config-constant';
import { deleteMany, ConfigUiUtility } from '../../utils/config-utility';
import { ConfigCustomDataService } from '../../services/config-customdata.service';

@Component({
  selector: 'app-config-profile-list',
  templateUrl: './config-profile-list.component.html',
  styleUrls: ['./config-profile-list.component.css']
})
export class ConfigProfileListComponent implements OnInit {

  constructor(private configProfileService: ConfigProfileService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private router: Router,private configKeywordsService: ConfigKeywordsService,private configCustomDataService: ConfigCustomDataService) { }

  profileData: ProfileData[];
  selectedProfileData: ProfileData[];

  profileDetail: ProfileData;

  profileListItem: SelectItem[];
  agentList: SelectItem[];
  displayNewProfile: boolean = false;
  showMsg: boolean = false;
  displayErrMsg = [];

  //Applied profile list
  appliedProfileList = [];

  isProfilePerm: boolean;
  ROUTING_PATH = ROUTING_PATH;

  userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");
  exportPath: string;

  /** To open file explorer dialog */
  openFileExplorerDialog: boolean = false;  
  isProfileListBrowse: boolean = false;

  editImportProfileDialog: boolean = false;
  editProfile: string;
  importFilepath: string;

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;

    /** Get list of applied profile in the application */
    this.configProfileService.getListOfAppliedProfile((data) => {
      this.appliedProfileList = data
      this.loadProfileList();
      this.loadAgentList();
      this.configKeywordsService.fileListProvider.subscribe(data => {
        this.uploadFile(data);
      })
    });
  }

  loadAgentList() {
    let key = ['Dot Net','Java', 'NodeJS'];
    this.agentList = ConfigUiUtility.createDropdown(key);

  }

  loadProfileList() {
    this.configProfileService.getProfileList().subscribe(data => {
      let tempArray = [];
      for (let i = 0; i < data.length; i++) {
        if (+data[i].profileId == 1 || +data[i].profileId == 777777 || +data[i].profileId == 888888) {
          tempArray.push(data[i]);
        }
      }

      this.profileData = data.reverse();
      this.profileData.splice(0, 3); 
      for (let i = 0; i < tempArray.length; i++) {
        this.profileData.push(tempArray[i]);
      }
    });
  }

  /**For opening Dialog box When Add Button is clicked */
  openProfileDialog() {
    this.profileDetail = new ProfileData();
    this.displayNewProfile = true;
  }

  /** This function is called to show specific agent profile in Copy profile dropDown*/
  getAgentSpecificProfiles(pro) {
    this.profileListItem = [];
    let arr = []; //This variable is used to sort Profiles
    for (let i = 0; i < this.profileData.length; i++) {
      arr.push(this.profileData[i].profileName);
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < this.profileData.length; j++) {
        if (pro == "Java" && this.profileData[j].agent == "Java" || this.profileData[j].agent == "-") {
          if (this.profileData[j].profileName == arr[i]) {
            this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
          }
        }
        else if (pro == "Dot Net" && this.profileData[j].agent == "Dot Net" || this.profileData[j].agent == "-") {
          if (this.profileData[j].profileName == arr[i]) {
            this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
          }
        }
        else if (pro == "NodeJS" && this.profileData[j].agent == "NodeJS" || this.profileData[j].agent == "-") {
          if (this.profileData[j].profileName == arr[i]) {
            this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
          }
        }
      }
    }
  }


  /**For Saving Dialog Data when Save Button Is clicked */
  saveNewProfile(): void {
    //to check if profile name already exists
    for (let i = 0; i < this.profileData.length; i++) {
      if (this.profileData[i].profileName == this.profileDetail.profileName) {
        this.configUtilityService.errorMessage("Profile name already exist");
        return;
      }
    }
    //to check if profile description is more than 500 characters
    this.profileDetail.userName = this.userName;
    if (this.profileDetail.profileDesc != null) {
      if (this.profileDetail.profileDesc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.configProfileService.addProfileData(this.profileDetail)
      .subscribe(data => {
        //Insert data in main table after inserting integration point detection in DB
        // this.profileData.push(data);

        //to insert new row in table ImmutableArray.push() is created as primeng 4.0.0 does not support above line 
        this.profileData = ImmutableArray.push(this.profileData, data);
        this.configUtilityService.successMessage(addMessage);
        this.loadProfileList();
      });
    this.displayNewProfile = false;
  }

  routeToConfiguration(selectedProfileId, selectedProfileName, entity, selectedProfileAgent) {

    sessionStorage.setItem("agentType", selectedProfileAgent);

    //Check if the selected profile is applied at running application or not if yes then set in session
    if(this.appliedProfileList.includes(selectedProfileName)){
      sessionStorage.setItem("isAppliedProfile", "true");
    }
    else{
      sessionStorage.setItem("isAppliedProfile", "false");
    }
    if (!('topoId' in entity) && !('tierId' in entity) && !('serverId' in entity) && !('instanceId' in entity))
      this.configProfileService.nodeData = { 'nodeType': null, 'nodeId': null, 'nodeName': null, 'topologyName' : null };

    //Observable profile name 
    this.configProfileService.profileNameObserver(selectedProfileName);
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  }

  /** To delete profile */
  deleteProfile() {
    if (!this.selectedProfileData || this.selectedProfileData.length < 1) {
      this.configUtilityService.errorMessage("Select a profile to delete");
      return;
    }
    if (this.selectedProfileData.length > 1) {
      this.configUtilityService.errorMessage("Select only one profile to delete")
      return;
    }
    if (this.selectedProfileData[0].profileId == 1 || this.selectedProfileData[0].profileId == 777777 || this.selectedProfileData[0].profileId == 888888) {
      this.configUtilityService.errorMessage("Default profile cannot be deleted");
      return;
    }
    this.confirmationService.confirm({
      message: 'Do you want to delete selected profile?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {

        this.configProfileService.deleteProfileData(this.selectedProfileData[0].profileId).subscribe(data => {
          // If profile is applied to any topology
          if (data._body != "ok") {
            this.showMsg = true;
            this.displayErrMsg = data._body.split(";");
            this.displayErrMsg.pop();
          }
          // If profile is not applied to any topology
          else {
            this.deleteProfiles(this.selectedProfileData[0].profileId);
            this.configUtilityService.infoMessage("Deleted successfully");
            this.loadProfileList();
          }
        })
      },
      reject: () => {

      }
    });

  }

  /**This method is used to delete profile */
  deleteProfiles(arrProfId: number): void {
    //For stores table row index
    let rowIndex: number[] = [];

    // for (let index in arrProfId) {
    rowIndex.push(this.getProfIndex(arrProfId));
    // }

    this.profileData = deleteMany(this.profileData, rowIndex);
    //clearing the array used for storing selected row
    this.selectedProfileData = [];
  }

  /**This method returns selected profile row on the basis of profId */
  getProfIndex(profId: number): number {
    for (let i = 0; i < this.profileData.length; i++) {
      if (this.profileData[i].profileId == profId) {
        return i;
      }
    }
    return -1;
  }

  exportProfile(){
    if (!this.selectedProfileData || this.selectedProfileData.length < 1) {
      this.configUtilityService.errorMessage("Select profile(s) to export");
      return;
    }

    for(let i = 0; i< this.selectedProfileData.length; i++){
      if(this.selectedProfileData[i].profileId == 1 || this.selectedProfileData[i].profileId == 777777 || this.selectedProfileData[i].profileId == 888888){
        this.configUtilityService.errorMessage("Default profile(s) cannot be exported");
        return;
      }
    }

    let selectedApp = this.selectedProfileData;
    let arrAppIndex = [];
    for (let index in selectedApp) {
      arrAppIndex.push(selectedApp[index].profileName);
    }
    this.exportPath = "defaultPath";
    this.configProfileService.exportProfile(this.exportPath,arrAppIndex).subscribe(data => {
      if(data.length == 0){
        this.configUtilityService.successMessage("Exported successfully");
      }
      else {
        this.configUtilityService.errorMessage("Export failure for profile(s):- " + data); 
      }
    })

  }

 /**used to open file manager
  */
  openFileManager() {
        this.openFileExplorerDialog = true;
        this.isProfileListBrowse = true;
  }
    
  /** This method is called form ProductUI config-nd-file-explorer component with the path
   ..\ProductUI\gui\src\app\modules\file-explorer\components\config-nd-file-explorer\ */
    
   /* dialog window & set relative path */
   uploadFile(filepath) {
     if (this.isProfileListBrowse == true) {
       this.isProfileListBrowse = false;
       this.openFileExplorerDialog = false;
       //Temporary path of the Method Monitor file to run locally,independently from Product UI
       //let filepath = "";
       this.importFilepath = filepath;
       let tempProfileName = "";
       if(!filepath.includes(".zip")){
        this.configUtilityService.errorMessage("Please select a valid zip file");
         return;
       }
        /**
         * The below code is done to check if the user sected profile is already present or not
         * If already present then user can edit the profile name which user wants to import
         */
       let zipFileName = filepath.split("/");
       if(zipFileName[zipFileName.length-1].includes("_")){
         tempProfileName = zipFileName[zipFileName.length-1].substring(0,zipFileName[zipFileName.length-1].lastIndexOf("_"));
       }
       for(let i = 0 ; i< this.profileData.length ; i++){
         if(tempProfileName == this.profileData[i].profileName){
          this.configUtilityService.infoMessage("Selected profile name is already there.Provide a new Profile Name");
          this.editImportProfileDialog = true;
         }
       }
       if(this.editImportProfileDialog == false){
        this.importFilepath = this.importFilepath + "+" + tempProfileName;
        this.configProfileService.importProfile(this.importFilepath,this.userName).subscribe(data => {
          this.importFilepath = "";
          if(data._body != 0){
            this.configCustomDataService.updateCaptureCustomDataFile(data._body);
            this.configUtilityService.successMessage("Profile imported successfully");
          }
          else{
            this.configUtilityService.errorMessage("Please select a valid zip file");
            return;
          }
          this.loadProfileList();
          });
       }

      }
     }
       
      // This method is used to edit the imported profile name
      saveEditProfile(){
        for(let i = 0 ; i< this.profileData.length ; i++){
          if(this.editProfile == this.profileData[i].profileName){
            this.configUtilityService.errorMessage("Profile name already exists");
            return;
          }
        }
        this.importFilepath = this.importFilepath + "+" + this.editProfile;
        this.configProfileService.importProfile(this.importFilepath,this.userName).subscribe(data => {
          this.importFilepath = "";
          this.editProfile = "";
          if(data._body != 0){
            /**
              * This service has been called to write the captureCustomData file after
              * completion of Import operation as we are unable to write the file from
              * backend by calling the same service(function).
              */
            this.configCustomDataService.updateCaptureCustomDataFile(data._body);
            this.configUtilityService.successMessage("Profile imported successfully");
          }
          else{
            this.configUtilityService.errorMessage("Please select a valid zip file");
            return;
          }
          this.editImportProfileDialog = false;
          this.loadProfileList();
          });
      }
      // for download Excel, word, Pdf File 
      downloadReports(reports: string) {
      var arrHeader = {"0":'Profile Name', "1":"Agent", "2": "Last Updated On","3": "Description"};
      var arrcolSize = {"0": 1, "1": 1, "2": 1, "3": 2};
      var arrAlignmentOfColumn = {"0": "left","1": "left","2": "right","3": "left"};
      var arrFieldName = {"0": "profileName","1": "agent","2": "timeStamp","3": "profileDesc"};
        let object =
          {
            data: this.profileData,
            headerList: arrHeader,
            colSize: arrcolSize,
            alignArr: arrAlignmentOfColumn,
            fieldName: arrFieldName,
            downloadType: reports,
            title: "Profile",
            fileName: "profile",
          }
  
          this.configKeywordsService.downloadReports(JSON.stringify(object)).subscribe(data => {
            this.openDownloadReports(data._body)
          })
       }
  
        /* for open download reports*/
    openDownloadReports(res) {
      window.open( "/common/" + res);
    }

  ngOnDestroy() {
   this.isProfileListBrowse = false;
  }
}
