import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigProfileService } from '../../services/config-profile.service'
//  import { ProfileInfo } from '../../interfaces/profile-info';
import { ProfileData } from '../../containers/profile-data';
import { ROUTING_PATH } from '../../constants/config-url-constant';
import { ImmutableArray } from '../../utils/immutable-array';
import { Messages, descMsg } from '../../constants/config-constant'

@Component({
  selector: 'app-config-profile-list',
  templateUrl: './config-profile-list.component.html',
  styleUrls: ['./config-profile-list.component.css']
})
export class ConfigProfileListComponent implements OnInit {

  constructor(private configProfileService: ConfigProfileService, private configUtilityService: ConfigUtilityService, private router: Router) { }

  profileData: ProfileData[];
  selectedProfileData: ProfileData[];

  profileDetail: ProfileData;

  profileListItem: SelectItem[];
  displayNewProfile: boolean = false;

  ROUTING_PATH = ROUTING_PATH;

  userName = sessionStorage.getItem("sesLoginName") == null ? "netstorm" : sessionStorage.getItem("sesLoginName");

  ngOnInit() {
    this.loadProfileList();
  }

  loadProfileList() {
    this.configProfileService.getProfileList().subscribe(data => {
      this.profileData = data;
    });
  }

  /**For opening Dialog box When Add Button is clicked */
  openProfileDialog() {
    /**When profileListItem is blank then create profileListItem */
    if (!this.profileListItem)
      this.loadProfileNameList();

    this.profileDetail = new ProfileData();
    this.displayNewProfile = true;
  }

  /**For Fetching Data in DropDown in Copy profile */
  loadProfileNameList() {
    this.profileListItem = [];
    let arr = []; //This variable is used to sort Profiles
    for (let i = 0; i < this.profileData.length; i++) {
      arr.push(this.profileData[i].profileName);
    }
    arr.sort();
      for (let i = 0; i< arr.length; i++){
        for (let j = 0; j < this.profileData.length; j++) {
          if(this.profileData[j].profileName == arr[i]){
            this.profileListItem.push({ label: arr[i], value: this.profileData[j].profileId });
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
        return ;
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
        this.profileData=ImmutableArray.push(this.profileData, data);
        this.configUtilityService.successMessage(Messages);
      });
    this.displayNewProfile = false;
  }

  routeToConfiguration(selectedProfileId, selectedProfileName) {
    //Observable profile name 
    this.configProfileService.profileNameObserver(selectedProfileName);
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  }
}
