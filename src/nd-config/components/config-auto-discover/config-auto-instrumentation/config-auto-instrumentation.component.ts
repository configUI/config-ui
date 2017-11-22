import { Component, OnInit } from '@angular/core';
import { AutoInstrumentationData } from '../../../containers/auto-instrumentation-data';

@Component({
  selector: 'app-config-auto-instrumentation',
  templateUrl: './config-auto-instrumentation.component.html'
//   styleUrls: ['./config-auto-instrumentation.component.css']
})
export class ConfigAutoInstrumentationComponent implements OnInit {

  index: number = 0;

  AutoInstrumentationData : AutoInstrumentationData[];

  constructor() { }

  ngOnInit() {
  }

  handleChange(e) {
    this.index = e.index;
    // this.router.navigate(['/profile/general', this.profileId, this.index]);
  }
}