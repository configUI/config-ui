import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotspot',
  templateUrl: './hotspot.component.html',
  styleUrls: ['./hotspot.component.css']
})
export class HotspotComponent implements OnInit {

  hotspotCapturingDialog:boolean;
  sampleInterval:number=500;
  matchCount:number=5;
  reportingInterval:number=0;
  depthHotspot:number=20;
  traceLevel:number=1;
  comparingDepth:number=10;
  
  constructor() { }

  ngOnInit() {
  }
  
  onclick(){
    this.hotspotCapturingDialog=true;
  }

}
