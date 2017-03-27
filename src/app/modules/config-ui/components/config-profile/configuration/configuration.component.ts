import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  profileId: number;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.profileId = params['profileId'] );  
    console.log("profileIdprofileId", this.profileId);
  }

}
