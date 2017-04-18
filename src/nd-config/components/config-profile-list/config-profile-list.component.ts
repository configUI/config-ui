import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

import { ConfigUtilityService } from '../../services/config-utility.service';
import { ConfigProfileService } from '../../services/config-profile.service'
//  import { ProfileInfo } from '../../interfaces/profile-info';
import { ProfileData } from '../../containers/profile-data';
import { ROUTING_PATH } from '../../constants/config-url-constant';

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
    for (let i = 0; i < this.profileData.length; i++) {
      this.profileListItem.push({ label: this.profileData[i].profileName, value: this.profileData[i].profileId });
    }
  }

  /**For Saving Dialog Data when Save Button Is clicked */
  saveNewProfile(): void {
    console.log("data is------>", this.profileDetail);

    this.configProfileService.addProfileData(this.profileDetail)
      .subscribe(data => {
        //Insert data in main table after inserting integration point detection in DB
        this.profileData.push(data);
      });
    this.displayNewProfile = false;
    this.configUtilityService.successMessage("Saved Successfully !!!");
  }

  routeToConfiguration(selectedProfileId, selectedProfileName) {
    //Observable profile name 
    this.configProfileService.profileNameObserver(selectedProfileName);
    this.router.navigate([this.ROUTING_PATH + '/profile/configuration', selectedProfileId]);
  }
}
