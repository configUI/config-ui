import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-config-profile-routing',
  templateUrl: './config-profile-routing.component.html',
  styleUrls: ['./config-profile-routing.component.css']
})
export class ConfigProfileRoutingComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // let profileId: number;
    // this.route.queryParams.subscribe((params: Params) => profileId = params['profileId']);
    
    // setTimeout(()=>{console.log("profileId***routing", profileId);}, 1000);
    // this.router.navigate(['/profile/configuration', profileId]);
  }

}
