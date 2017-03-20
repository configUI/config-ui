import { Component, OnInit } from '@angular/core';
import { ConfigUtilityService } from '../../services/config-utility.service';
@Component({
  selector: 'app-config-main',
  templateUrl: './config-main.component.html',
  styleUrls: ['./config-main.component.css']
})
export class ConfigMainComponent implements OnInit {

  constructor(private configUtilityService: ConfigUtilityService) { }

  isProgressBar: boolean = false;
  color: string = "primary";
  
  ngOnInit() {
    this.configUtilityService.progressBarProvider$.subscribe(flag=> {
      this.isProgressBar = flag["flag"];
      this.color = flag["color"];
    });
  }

}
