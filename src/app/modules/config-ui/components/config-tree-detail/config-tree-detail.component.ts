import { Component, OnInit } from '@angular/core';
import { ConfigTopologyService } from '../../services/config-topology.service';

@Component({
  selector: 'app-config-tree-detail',
  templateUrl: './config-tree-detail.component.html',
  styleUrls: ['./config-tree-detail.component.css']
})
export class ConfigTreeDetailComponent implements OnInit {

  constructor(private configTopologyService: ConfigTopologyService) { }

  ngOnInit() {
    this.loadTopologyData();
  }

  loadTopologyData(): void{
    
  }
}
