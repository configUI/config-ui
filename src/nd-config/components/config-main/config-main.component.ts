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
  calcheight : String = "340px";
  
  ngOnInit() {
    this.configUtilityService.progressBarProvider$.subscribe(flag=> {
      //For resolve this error in Dev Mode add Timeout method -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
      setTimeout(()=>{
        this.isProgressBar = flag["flag"];
        this.color = flag["color"];
      }, 1);
      
    });
       this.calcheight = window.innerHeight - 81 + "px";	
  }

}
