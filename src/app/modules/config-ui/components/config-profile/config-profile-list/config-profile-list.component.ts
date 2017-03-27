import { Component, OnInit } from '@angular/core';
import { ConfigProfileService } from '../../../services/config-profile.service'
import { ProfileInfo } from '../../../interfaces/profile-info';

@Component({
  selector: 'app-config-profile-list',
  templateUrl: './config-profile-list.component.html',
  styleUrls: ['./config-profile-list.component.css']
})
export class ConfigProfileListComponent implements OnInit {

  constructor(private configProfileService: ConfigProfileService) { }

  profileData: ProfileInfo[];

  ngOnInit() {
    this.loadProfileList();
  }

  loadProfileList() {
    this.configProfileService.getProfileList().subscribe(data=> {
      this.profileData = data; 
    });
  }

}
