import { Component, OnInit, Input } from '@angular/core';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
@Component({
  selector: 'app-service-entry-point',
  templateUrl: './service-entry-point.component.html',
  styleUrls: ['./service-entry-point.component.css']
})
export class ServiceEntryPointComponent implements OnInit {

  @Input()
  profileId: number;

  serviceEntryData: any[];
  displayNewService: boolean;

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.loadServiceEntryPoint();
  }

  loadServiceEntryPoint() {
    this.configKeywordsService.getServiceEntryPointList(this.profileId)
      .subscribe(data => this.serviceEntryData = data);
  }

  openServiceEntryDialog() {
    this.displayNewService = true;
  }

}
