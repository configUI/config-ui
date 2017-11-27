import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-auto-discover',
  templateUrl: './config-auto-discover.component.html',
  styleUrls: ['./config-auto-discover.component.css']
})
export class ConfigAutoDiscoverComponent implements OnInit {

  index: number = 0;

  constructor() { }

  ngOnInit() {
  }

  handleChange(e) {
    this.index = e.index;
    // this.router.navigate(['/profile/general', this.profileId, this.index]);
  }
}