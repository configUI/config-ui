import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigProfileService } from '../../services/config-profile.service'
//  import { ProfileInfo } from '../../interfaces/profile-info';
import { ProfileData } from '../../containers/profile-data';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ImmutableArray } from '../../utils/immutable-array';
import { Messages, descMsg } from '../../constants/config-constant';
import { deleteMany, ConfigUiUtility } from '../../utils/config-utility';

@Component({
  selector: 'app-config-profile-list',
  templateUrl: './config-profile-list.component.html',
  styleUrls: ['./config-profile-list.component.css']
})
export class ConfigProfileListComponent implements OnInit {

  constructor(private configProfileService: ConfigProfileService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private router: Router) { }

  profileData: ProfileData[];
  selectedProfileData: ProfileData[];

  profileDetail: ProfileData;

  profileListItem: SelectItem[];
  agentList: SelectItem[];
  displayNewProfile: boolean = false;
  showMsg: boolean = false;
  displayErrMsg = [];

  isProfilePerm: boolean;
  ROUTING_PATH = ROUTING_PATH;

  userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");

  ngOnInit() {
    this.isProfilePerm=+sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.loadProfileList();
    this.loadAgentList();
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
        this.configUtilityService.successMessage(Messages);
        this.loadProfileList();
      });
    this.displayNewProfile = false;
  }

  routeToConfiguration(selectedProfileId, selectedProfileName, entity, selectedProfileAgent) {

    sessionStorage.setItem("agentType", selectedProfileAgent);
    if (!('topoId' in entity) && !('tierId' in entity) && !('serverId' in entity) && !('instanceId' in entity))
      this.configProfileService.nodeData = { 'nodeType': null, 'nodeId': null };

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
    if (this.selectedProfileData[0].profileId == 1) {
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
          if (data != "") {
            this.showMsg = true;
            this.displayErrMsg = data.split(";");
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

}
