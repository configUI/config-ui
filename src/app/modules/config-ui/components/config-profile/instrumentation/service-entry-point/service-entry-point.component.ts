import { Component, OnInit, Input } from '@angular/core';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ServiceEntryPoint } from '../../../../containers/instrumentation-data';
import {SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-service-entry-point',
  templateUrl: './service-entry-point.component.html',
  styleUrls: ['./service-entry-point.component.css']
})
export class ServiceEntryPointComponent implements OnInit {

  @Input()
  profileId: number;
  /**It store service entry data */
  serviceEntryData: ServiceEntryPoint[];
  /**It store service entry data for add*/
  serviceEntryPointDetail: ServiceEntryPoint;
  entryPointType:SelectItem[];

/**It is used as flag to open or close dialog */
  displayNewService: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService) { }

  ngOnInit() {
    this.loadServiceEntryPoint();
  }
/**It loads service entry data  */
  loadServiceEntryPoint() {
    this.configKeywordsService.getServiceEntryPointList(this.profileId)
      .subscribe(data => this.serviceEntryData = data);
  }

/**This method is called when we click on Add button to open dialog  */
  openServiceEntryDialog() {
    this.loadEntryPointTypeList();
     this.serviceEntryPointDetail = new ServiceEntryPoint();
     this.displayNewService = true;
  }
/**It adds data in dropdown of Entry type service */
    loadEntryPointTypeList(){
    this.entryPointType = [];
    for (let i = 0; i < this.serviceEntryData.length; i++) {
      this.entryPointType.push({ label: this.serviceEntryData[i].entryType, value: this.serviceEntryData[i].entryTypeId });
    }
  }

  /**It stores the dialog data back to the backend */
  saveServiceEntryPointService(): void {
    for (let i = 0; i < this.entryPointType.length; i++){
      if(this.serviceEntryPointDetail.entryTypeId ==this.entryPointType[i].value ){
        this.serviceEntryPointDetail.entryType = this.entryPointType[i].label; 
      }
    }
      this.configKeywordsService.addServiceEntryPointData(this.serviceEntryPointDetail,this.profileId)
        .subscribe(data => {
          //Insert data in main table after inserting service in DB
          this.serviceEntryData.push(data);
        });
      this.displayNewService = false;
  }

}
