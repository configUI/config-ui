import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../../containers/keyword-data';

import { IntegrationPTDetection, BackendTableInfo, AddIPDetection, NamingRuleAndExitPoint, EndPointInfo, EndPoint, NamingRule } from '../../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../../services/config-utility.service';
import { INTEGRATION_TYPE } from '../../../../../constants/config-constant';
import { BackendInfo } from '../../../../../interfaces/instrumentation-info';

import { cloneObject } from '../../../../../utils/config-utility';
import { ImmutableArray } from '../../../../../utils/immutable-array';

import { Messages, descMsg , addMessage } from '../../../../../constants/config-constant'

import { ActivatedRoute, Params } from '@angular/router'; 

@Component({
  selector: 'app-integration-pt',
  templateUrl: './integration-pt.component.html',
  styleUrls: ['./integration-pt.component.css']
})
export class IntegrationPtComponent implements OnInit {

  @Output()
  keywordData = new EventEmitter();

  @Input()
  saveDisable: boolean;

  @Input()
  profileId: number;

  ipDetectionData: BackendTableInfo[];

  selectedIpDetectionData: IntegrationPTDetection;

  integrationDetail: IntegrationPTDetection;
  namingRuleAndExitPoint: NamingRuleAndExitPoint;


  addIPDetectionDetail: AddIPDetection;

  backendInfo: BackendInfo[];

  integrationPoints: Object;
  subscription: Subscription;

  /**These are those keyword which are used in current screen. */
  keywordList = ['NDEntryPointsFile', 'ndBackendNamingRulesFile'];

  displayNewIPDetection: boolean = false;
  detailDialog: boolean = false;

  backendTypeSelecetItem: SelectItem[] = [];
  IP = INTEGRATION_TYPE;

  endPoint: EndPoint[];
  agentType: string = "";
  isProfilePerm: boolean;
  checkboxtrue: boolean = true;

  argumentIndexSelecetItem: SelectItem[] = [];

  DATA_TYPE = {
    BOOLEAN: 'Z',
    SHORT: 'S',
    INTEGER: 'I',
    STRING: 'Ljava/lang/String;',
    BYTE: 'B',
    FLOAT: 'F',
    DOUBLE: 'D',
    LONG: 'J',
    CHAR: 'C',
    VOID: 'V'
  };

  DATA_TYPE_ARR = [
    this.DATA_TYPE.BOOLEAN,
    this.DATA_TYPE.SHORT,
    this.DATA_TYPE.INTEGER,
    this.DATA_TYPE.STRING,
    this.DATA_TYPE.BYTE,
    this.DATA_TYPE.FLOAT,
    this.DATA_TYPE.DOUBLE,
    this.DATA_TYPE.LONG,
    this.DATA_TYPE.CHAR,
    this.DATA_TYPE.VOID
  ];

  constructor(private route: ActivatedRoute, private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private confirmationService: ConfirmationService, private store: Store<KeywordList>) {
    this.agentType = sessionStorage.getItem("agentType");
    this.subscription = this.store.select("keywordData").subscribe(data => {
      var keywordDataVal = {}
      this.keywordList.map(function (key) {
        keywordDataVal[key] = data[key];
      })
      this.integrationPoints = keywordDataVal;
    });

    // this.loadIntegrationPTDetectionList();
    // this.loadBackendInfoList();
  }

  ngOnInit() {
    this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
    this.route.params.subscribe((params: Params) => {
      this.profileId = params['profileId'];
      if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
        this.saveDisable = true;
    });
    this.loadIntegrationPTDetectionList();
    this.loadBackendInfoList();
  }

  /**This method is called to load Data in Table */
  loadIntegrationPTDetectionList() {

    this.configKeywordsService.getIntegrationPTDetectionList(this.profileId).subscribe(data => {
      this.ipDetectionData = data["backendDetail"];
    });
  }

  loadBackendInfoList() {
    this.configKeywordsService.getBackendList(this.profileId).subscribe(data => {
      this.backendInfo = data;
      this.createBackendTypeSelectItem();
    });
  }

  /**To Fetch data to show the Backend Type in Dropdown Of Dialog box of ADD functionality */
  createBackendTypeSelectItem() {
    this.backendTypeSelecetItem = [];
    let arr = [];
    for (let i = 0; i < this.backendInfo.length; i++) {
      arr.push(this.backendInfo[i].backendTypeName);
    }
    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < this.backendInfo.length; j++) {
        if (arr[i] == this.backendInfo[j].backendTypeName) {
          this.backendTypeSelecetItem.push({ label: arr[i], value: this.backendInfo[j].backendTypeId });
        }
      }
    }
  }

  /**This method is called to Open Dialog to add new IntegrationPTDetection when you click ADD Button */
  onAddIntegrationPTDetection() {
    this.addIPDetectionDetail = new AddIPDetection();
    this.displayNewIPDetection = true;
  }

  /**This method is called to save the Data Add New Integration Point Detection data */
  saveAddIntegrationPTDetection(): void {
    if (this.addIPDetectionDetail.desc != null) {
      if (this.addIPDetectionDetail.desc.length > 500) {
        this.configUtilityService.errorMessage(descMsg);
        return;
      }
    }
    this.addIPDetectionDetail.fqm = this.addIPDetectionDetail.fqm.trim();
    this.addIPDetectionDetail.agent = this.agentType;
    if (this.agentType == "Java") {
      this.addIPDetectionDetail.module = "-";
    }
    this.configKeywordsService.addIntegrationPTDetectionData(this.profileId, this.addIPDetectionDetail)
      .subscribe(data => {
        //Getting index for set data in main array table data.
        let index = this.getTableIndex(data.backendTypeId);

        //Insert data in main table after inserting integration point detection in DB
        let endPointData: EndPoint = new EndPoint();
        endPointData.id = data.id;
        endPointData.description = data.desc;
        endPointData.enabled = data.enabled;
        endPointData.fqm = data.fqm;
        endPointData.name = data.name;
        endPointData.argumentIndex = data.argumentIndex;
        if (this.agentType == "Java") {
          endPointData.agent = "Java";
          endPointData.module = "-";
        }
        else if (this.agentType == "Dot Net") {
          endPointData.agent = "Dot Net";
        }
        // this.ipDetectionData[index].lstEndPoints.push(endPointData);

        this.ipDetectionData[index].lstEndPoints = ImmutableArray.push(this.ipDetectionData[index].lstEndPoints, endPointData);
        this.loadIntegrationPTDetectionList();
        this.configUtilityService.successMessage(addMessage);
      });
    this.displayNewIPDetection = false;

  }

  onRowSelect() {
    if (this.isProfilePerm) {
      this.detailDialog = false;
    }
    else
      this.detailDialog = true;
    this.integrationDetail = cloneObject(this.selectedIpDetectionData);
  }

  /**This method is used to update Naming Rules & Exit Points data. */
  saveIntegrationDetail() {
    this.namingRuleAndExitPoint = new NamingRuleAndExitPoint();
    this.namingRuleAndExitPoint.backendTypeId = this.integrationDetail.id;
    this.namingRuleAndExitPoint.databaseProductName = this.integrationDetail.namingRule.databaseProductName;
    this.namingRuleAndExitPoint.driverName = this.integrationDetail.namingRule.driverName;
    this.namingRuleAndExitPoint.databaseProductVersion = this.integrationDetail.namingRule.databaseProductVersion;
    this.namingRuleAndExitPoint.driverVersion = this.integrationDetail.namingRule.driverVersion;
    this.namingRuleAndExitPoint.host = this.integrationDetail.namingRule.host;
    this.namingRuleAndExitPoint.port = this.integrationDetail.namingRule.port;
    this.namingRuleAndExitPoint.serviceName = this.integrationDetail.namingRule.serviceName;
    this.namingRuleAndExitPoint.tableName = this.integrationDetail.namingRule.tableName;
    this.namingRuleAndExitPoint.topicName = this.integrationDetail.namingRule.topicName;
    this.namingRuleAndExitPoint.url = this.integrationDetail.namingRule.url;
    this.namingRuleAndExitPoint.userName = this.integrationDetail.namingRule.userName;
    this.namingRuleAndExitPoint.lstEndPoints = [];
    this.namingRuleAndExitPoint.query = this.integrationDetail.namingRule.query;

    for (let i = 0; i < this.integrationDetail.lstEndPoints.length; i++) {
      this.namingRuleAndExitPoint.lstEndPoints[i] = { id: this.integrationDetail.lstEndPoints[i].id, enabled: this.integrationDetail.lstEndPoints[i].enabled };;
    }

    this.detailDialog = false;
    this.configKeywordsService.addIPNamingAndExit(this.profileId, this.namingRuleAndExitPoint.backendTypeId, this.namingRuleAndExitPoint)
      .subscribe(data => {
        //Getting index for set data in main array table data.
        let index = this.getTableIndex(data.backendTypeId);
        this.setNamingRuleAndExitPointData(this.ipDetectionData[index].namingRule, data);
        this.setEndPointData(this.ipDetectionData[index].lstEndPoints, data.lstEndPoints);
        this.loadIntegrationPTDetectionList();
        this.configUtilityService.successMessage(addMessage);
      }
      );
  }

  /**
   * Set NamingRuleAndExitPoint data in main table.
   * @param NamingRule of maintable data.
   * @param updated NamingRule.
   */
  setNamingRuleAndExitPointData(backendTableInfo: NamingRule, data: NamingRuleAndExitPoint) {
    backendTableInfo.databaseProductName = data.databaseProductName;
    backendTableInfo.databaseProductVersion = data.databaseProductVersion;
    backendTableInfo.driverName = data.driverName;
    backendTableInfo.driverVersion = data.driverVersion;
    backendTableInfo.host = data.host;
    backendTableInfo.port = data.port;
    backendTableInfo.query = data.query;
    backendTableInfo.serviceName = data.serviceName;
    backendTableInfo.tableName = data.tableName;
    backendTableInfo.topicName = data.topicName;
    backendTableInfo.url = data.url;
    backendTableInfo.userName = data.userName;
  }

  /**Used to set updated EndPoint Data in main table. */
  setEndPointData(mainTableEndPoints: EndPoint[], updatedEndPoints: EndPointInfo[]) {
    for (let i = 0; i < mainTableEndPoints.length; i++) {
      mainTableEndPoints[i].enabled = this.getEndPointValue(mainTableEndPoints[i].id, updatedEndPoints);
    }
  }

  /**
   *  This method return EndPoint Value ie. enabled/disabled
   */
  getEndPointValue(id, updatedEndPoints: EndPointInfo[]): boolean {
    for (let i = 0; i < updatedEndPoints.length; i++) {
      if (id == updatedEndPoints[i].id) {
        return updatedEndPoints[i].enabled;
      }
    }
    return false;
  }

  /**This method match the backend id with backend rowdata's id.
   * It will return row index for update data.
   */
  getTableIndex(backendId: number) {
    for (let i = 0; i < this.ipDetectionData.length; i++) {
      if (this.ipDetectionData[i].id == backendId) {
        return i;
      }
    }
  }

  /**This method is used to delete the Integration point
   * This method will also check if the integration point is pre-Defined or custom type.
   */
  deleteIP(event) {
    this.confirmationService.confirm({
      message: 'Do you want to delete the selected row?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        //Get Selected Applications's AppId
        let ipID = event["id"];
        this.configKeywordsService.deleteIntegrationPointData(ipID, this.profileId)
          .subscribe(data => {
            for (let i = 0; i < this.integrationDetail.lstEndPoints.length; i++) {
              if (this.integrationDetail.lstEndPoints[i] == event) {
                this.integrationDetail.lstEndPoints.splice(i, 1);
              }
            }
            this.loadIntegrationPTDetectionList();
            this.configUtilityService.infoMessage("Deleted Successfully");
          })
      },
      reject: () => {
      }
    });
  }
  saveIntegrationPointOnFile() {
    this.configKeywordsService.saveIntegrationPointData(this.profileId)
      .subscribe(data => {
        //this.configUtilityService.successMessage("Saved Successfully");
        let that = this;
        let filePath;
        that.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
          //For sending Runtime Changes
          filePath = data["_body"];
          that.integrationPoints['NDEntryPointsFile'].path = filePath + "/NDEntryPointFile.txt";;
          that.integrationPoints['ndBackendNamingRulesFile'].path = filePath + "/BackendNamingRule.txt";
          that.keywordData.emit(that.integrationPoints);
        });
        console.log("return type", data)
      })
  }


    /**
     * This Method will be called when user clicks the
     * Argument Index dropdown
     * @param fqm 
     * @param id
     */
    validateArgAndGetArgumentsNumberList(fqm,id) {
      if (fqm == null || fqm == "") {
        this.configUtilityService.errorMessage("Fill out fully qualified method name first");
        this.argumentIndexSelecetItem = [];
        return;
      }
      else if(id == 14){
        this.validateArgumentType(fqm);
      }
      else {
        let argStart = fqm.indexOf("(");
        let argEnd = fqm.indexOf(")");
        let args = fqm.substring(argStart + 1, argEnd);
        //flag used for creating string "Ljava/lang/String;"
        let flag = false;
        let length = 0;
        let string = '';
        if (args.length == 0) {
          this.configUtilityService.errorMessage("No Arguments present in Fqm")
        }
        else {
          for (let i = 0; i < args.length; i++) {
            if (args[i] == "L") {
              flag = true;
              string = string + args[i];
              continue;
            }
            else if (flag) {
              if (args[i] == ";") {
                string = string + args[i];
                  length++;
                  string = '';
                  flag = false;
              }
              else
                string = string + args[i];
  
            }
            else {
              if (this.DATA_TYPE_ARR.indexOf(args[i]) == -1) {
                this.configUtilityService.errorMessage("Invalid Argument Data Type")
                return;
              }
              else {
                length++;
              }
            }
          }
        }
        this.argumentIndexSelecetItem = [];
        for (let i = 1; i <= length; i++) {
          this.argumentIndexSelecetItem.push({ 'value': i, 'label': i + '' });
        }
      }
    }

    /**
     * This method is used to create dropdown for Custom Error logs
     * @param fqm 
     */
    validateArgumentType(fqm) {
      let count = [];
      if (fqm != null) {
        this.argumentIndexSelecetItem = [];
        let argStart = fqm.indexOf("(");
        let argEnd = fqm.indexOf(")");
        let args = fqm.substring(argStart + 1, argEnd);
        let argument = args.split(";");
        for (let i = 0; i <= argument.length; i++) {
          if (argument[i] == 'Ljava/lang/Throwable') {
            let index;
            index = i + 1;
            this.argumentIndexSelecetItem.push({ 'value': index, 'label': index + '' });
          }
        }
      }
    }
  /**
 * Purpose : To invoke the service responsible to open Help Notification Dialog
 * related to the current component.
 */
  sendHelpNotification() {
    this.configKeywordsService.getHelpContent("Instrumentation", "Integartion Point Detection", "");
  } 
}

