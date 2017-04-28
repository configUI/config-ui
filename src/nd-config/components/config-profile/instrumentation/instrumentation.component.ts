import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-instrumentation',
  templateUrl: './instrumentation.component.html',
  styleUrls: ['./instrumentation.component.css']
})
export class InstrumentationComponent implements OnInit {

  profileId: number;
  index: number = 0;
  saveDisable: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) =>{
      this.profileId = params['profileId'];
      this.saveDisable=this.profileId==1? true:false;
      this.index = params['tabId'];


    });
  }

  handleChange(e){
    this.index = e.index;
  }
}
