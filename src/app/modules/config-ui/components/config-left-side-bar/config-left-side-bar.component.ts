import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-left-side-bar',
  templateUrl: './config-left-side-bar.component.html',
  styleUrls: ['./config-left-side-bar.component.css']
})
export class ConfigLeftSideBarComponent implements OnInit {

  navMenuArray = [];

  constructor() { }

  ngOnInit() {
    /* Main Menu Array.  */
    this.navMenuArray = [
      { label: "Home", route: "home", icon: "fa fa-home", tooltip: "Home" },
      { label: "Application", route: "application-list", icon: "fa fa-bars", tooltip: "Application" },
      { label: "Profile", route: "profile/profile-list", icon: "fa fa-user", tooltip: "Profile" },
      { label: "Topology", route: "topology-list", icon: "fa fa-object-group", tooltip: "Topology" },
      { label: "ND Agent", route: "nd-agent", icon: "fa fa-users", tooltip: "ND Agent" },
      { label: "Discover Instrumentation Profile", route: "nd-agent", icon: "fa fa-tint", tooltip: "Discover Instrumentation Profile" }
    ];
  }

}
