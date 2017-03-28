import { Component, OnInit } from '@angular/core';
import { ConfigBusinessTranService } from '../../../../../services/config-business-trans-global-service';
import { BusinessTransMethodInfo } from '../../../../../interfaces/business-Trans-Method-info';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-method-bt-configuration',
  templateUrl: './method-bt-configuration.component.html',
  styleUrls: ['./method-bt-configuration.component.css']
})
export class MethodBTConfigurationComponent implements OnInit {

  /* Assign data to Method Data table */
  businessTransMethodInfo: BusinessTransMethodInfo;

  /* open dialog box */
  addBusinessTransMethodDialog: boolean = false;
  addReturnTypeDialog : boolean = false;

  /* Assign value to return type drop down */
  returnTypeList: SelectItem[];

  /*selected item from return type list*/
  selectedReturnType: string;

  constructor(private configBusinessTranService: ConfigBusinessTranService) {
    this.returnTypeList = [];
    this.returnTypeList.push({ label: 'NUMARIC', value: 'numaric' });
    this.returnTypeList.push({ label: 'STRING', value: 'string' });
    this.returnTypeList.push({ label: 'BOOLEAN', value: 'boolean' });
    this.returnTypeList.push({ label: 'CHAR OR BYTE', value: 'charorbyte' });
  }

  ngOnInit() {
    this.loadBTMethodData();
  }

  loadBTMethodData(): void {
    this.configBusinessTranService.getBusinessTransMethodData().subscribe(data => this.businessTransMethodInfo = data);
  }

  openMethodDialog() {
    this.addBusinessTransMethodDialog = true;
  }

  openAddReturnTypeDialog(){
    this.addReturnTypeDialog = true;
  }

  deleteRetunType()
  {

  }

  saveEditApp()
  {
    
  }

}
