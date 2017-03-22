import { Component, OnInit } from '@angular/core';
import { ConfigNdAgentService } from '../../services/config-nd-agent.service';
import { NDAgentInfo } from '../../interfaces/nd-agent-info';

@Component({
  selector: 'app-config-nd-agent',
  templateUrl: './config-nd-agent.component.html',
  styleUrls: ['./config-nd-agent.component.css']
})
export class ConfigNdAgentComponent implements OnInit {

 constructor(private configNdAgentService: ConfigNdAgentService ) { }

    /**Getting application list data */
    ndAgentStatusData : NDAgentInfo[];

  ngOnInit() {
    this.loadNDAgentStatusData();
    
  }

   /**Getting application list data */
  loadNDAgentStatusData(): void {
    this.configNdAgentService.getNDAgentStatusData().subscribe(data => this.ndAgentStatusData = data);
    
  }

}
