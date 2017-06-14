import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';

import { ServiceEntryPoint } from '../../../../containers/instrumentation-data';
import { ServiceEntryType } from '../../../../interfaces/instrumentation-info';

import { ImmutableArray } from '../../../../utils/immutable-array';

import { Messages, descMsg } from '../../../../constants/config-constant'

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
  entryPointType: SelectItem[];
  @Input()
  saveDisable: boolean = false;

  /**It is used as flag to open or close dialog */
  displayNewService: boolean = false;

  constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService) { }

  ngOnInit() {
    this.loadServiceEntryPoint();
    this.saveDisable = this.profileId == 1 ? true : false;
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
  loadEntryPointTypeList() {
    //EntryPointType contains some values then return. no need to get data from server.
    if (this.entryPointType)
      return;

    this.entryPointType = [];

    this.configKeywordsService.getEntryPointTypeList()
      .subscribe(entryPointTypeList => {
        for (let i = 0; i < entryPointTypeList.length; i++) {
          this.entryPointType.push({ label: entryPointTypeList[i].entryTypeName, value: entryPointTypeList[i].entryTypeId });
        }
      });
  }

  /**It stores the dialog data back to the backend */
  saveServiceEntryPointService(): void {
    if (this.serviceEntryPointDetail.desc != null) {
      if (this.serviceEntryPointDetail.desc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    for (let i = 0; i < this.entryPointType.length; i++) {
      if (this.serviceEntryPointDetail.entryTypeId == this.entryPointType[i].value) {
        this.serviceEntryPointDetail.entryType = this.entryPointType[i].label;
      }
    }
    this.serviceEntryPointDetail.fqm = this.serviceEntryPointDetail.fqm.trim();
    this.configKeywordsService.addServiceEntryPointData(this.serviceEntryPointDetail, this.profileId)
      .subscribe(data => {
        //Insert data in main table after inserting service in DB
        // this.serviceEntryData.push(data);
        this.serviceEntryData = ImmutableArray.push(this.serviceEntryData, data);
        this.configUtilityService.successMessage(Messages);
      });
    this.displayNewService = false;
  }

  /**Used to enabled/Disabled Service Entry Points */
  enableToggle(rowData: ServiceEntryPoint) {
    this.configKeywordsService.enableServiceEntryPointList(rowData.id, !rowData.enabled).subscribe(
      data => {
        if (rowData.enabled == true) {
          this.configUtilityService.infoMessage("Service entry point is enabled successfully.");
        }
        else {
          this.configUtilityService.infoMessage("Service entry point is disabled successfully.");
        }
      }
    );
  }

}
