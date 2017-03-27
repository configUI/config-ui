import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-instrument-monitors',
  templateUrl: './instrument-monitors.component.html',
  styleUrls: ['./instrument-monitors.component.css']
})
export class InstrumentMonitorsComponent implements OnInit {

  @Input()
  profileId: number;

  constructor() { }

  ngOnInit() {
  }

}
