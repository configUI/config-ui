import { Component, OnInit } from '@angular/core';
import { ROUTING_PATH } from '../../constants/config-url-constant';

@Component({
  selector: 'app-config-left-side-bar',
  templateUrl: './config-left-side-bar.component.html',
  styleUrls: ['./config-left-side-bar.component.css']
})
export class ConfigLeftSideBarComponent implements OnInit {

  navMenuArray = [];
  ROUTING_PATH = ROUTING_PATH;

  constructor() { }

  ngOnInit() {
    /* Main Menu Array.  */
    this.navMenuArray = [
      { label: "Home", route: `${ROUTING_PATH}/home`, icon: "fa fa-home", tooltip: "Home" },
      { label: "Application", route: `${ROUTING_PATH}/application-list`, icon: "fa fa-bars", tooltip: "Application" },
      { label: "Profile", route: `${ROUTING_PATH}/profile/profile-list`, icon: "fa fa-user", tooltip: "Profile" },
      { label: "Topology", route: `${ROUTING_PATH}/topology-list`, icon: "fa fa-user", tooltip: "Topology" },
      { label: "ND Agent", route: `${ROUTING_PATH}/nd-agent`, icon: "fa fa-users", tooltip: "ND Agent" },
     // { label: "Discover Instrumentation Profile", route: `${ROUTING_PATH}/nd-agent`, icon: "fa fa-tint", tooltip: "Discover Instrumentation Profile" }
    ];
  }

}
