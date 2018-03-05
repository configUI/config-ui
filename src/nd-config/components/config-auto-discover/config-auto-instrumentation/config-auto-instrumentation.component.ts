import { Component, OnInit } from '@angular/core';
import { AutoIntrDTO } from '../../../interfaces/topology-info';
import { ConfigTopologyService } from '../../../services/config-topology.service';
import { ConfigHomeService } from '../../../services/config-home.service';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import * as URL from '../../../constants/config-url-constant';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../../constants/config-url-constant';
import { ConfigApplicationService } from '../../../services/config-application.service';



@Component({
  selector: 'app-config-auto-instrumentation',
  templateUrl: './config-auto-instrumentation.component.html'
  //   styleUrls: ['./config-auto-instrumentation.component.css']
})
export class ConfigAutoInstrumentationComponent implements OnInit {
  ROUTING_PATH = ROUTING_PATH;
  /* To show Active Auto instrumentation list */
  autoIntrActive: AutoIntrDTO[] = [];
  selectedAutoIntrActive: AutoIntrDTO;

  /* To show Complete auto instrumented list */
  autoIntrComplete: AutoIntrDTO[] = [];
  selectedAutoIntrComplete: AutoIntrDTO[];
  activeCount: string;
  isAutoPerm: boolean;
  isTestRun: boolean;
  className: string = "Auto Instrument Component";

  constructor(private configTopologyService: ConfigTopologyService, private router: Router, private configUtilityService: ConfigUtilityService,
    private configHomeService: ConfigHomeService, private configApplicationService: ConfigApplicationService
  ) { }

  ngOnInit() {
    let TrNumber = sessionStorage.getItem("isTrNumber");
    if (TrNumber == null || TrNumber == "null" || TrNumber == undefined || TrNumber == '')
      this.isTestRun = false;
    else
      this.isTestRun = true;

    this.isAutoPerm = +sessionStorage.getItem("AutoDiscoverAccess") == 4 ? true : false;
    let that = this;

    // this.configTopologyService.getAIData().subscribe(data => {
    //   //Checking is auto instrumentation is in running state or complete
    //   this.checkForCompleteOrActive(data)
    // })

    this.configTopologyService.updateAIDetails().subscribe(data => {
      this.checkForCompleteOrActive(data)
    })

  }

  //Updating Active and Complete tables
  checkForCompleteOrActive(data) {
    let autoIntrComplete = [];
    let autoIntrActive = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].status == "complete") {
        autoIntrComplete.push(data[i])
        //  this.configHomeService.AIStartStopOpertationValueList(false);
      }
      else {
        autoIntrActive.push(data[i]);
        this.configHomeService.AIStartStopOpertationValueList(true);
      }
    }
    if (autoIntrActive.length == 0) {
      this.configHomeService.AIStartStopOpertationValueList(false);
    }
    this.autoIntrComplete = autoIntrComplete;
    this.autoIntrActive = autoIntrActive;
    this.activeCount = "(Active: " + this.autoIntrActive.length + ")"
  }

  //To stop auto-insrumentation
  stopInstrumentation(instanceName, sessionName) {
    let that = this;
    console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
    let strSetting = "";
    //if test is offline mode, return (no run time changes)
    // if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null) {
    //   console.log(this.className, "constructor", "No NO RUN TIme Changes");
    //   this.configUtilityService.errorMessage("Test is not running")
    //   return;
    // }
    // else {
    //Getting keywords data whose values are different from default values
    console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData");
    const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;
    strSetting = "enableAutoInstrSession=0;"
    //Merging configuration and instance name with #
    strSetting = strSetting + "#" + instanceName;

    //Saving settings in database
    this.configTopologyService.sendRTCTostopAutoInstr(url, strSetting, instanceName, sessionName, function (data) {
      if (data.length != 0 && data[0]['id']) {
        that.checkForCompleteOrActive(data);
        that.configHomeService.AIStartStopOpertationValueList(false);
      }
    })
    // }
  }

  openGUIForAutoInstrumentation(sessionFileName) {

    this.configTopologyService.getSessionFileExistOrNot(sessionFileName).subscribe(data => {

      var status = data['_body'].split("#");

      if (status[1] == "NotEmpty" && status[0] == "Empty") {
        this.router.navigate([ROUTING_PATH + '/auto-discover/auto-instrumentation', sessionFileName + "_AI.txt"]);
      }
      else if (status[0] == "Fail") {
        this.configUtilityService.errorMessage("Session file does not exists. Download it ");
        return;
      }
      else if (status[0] == "Empty") {
        this.configUtilityService.errorMessage("Session file is empty.");
        return;
      }
      else if (status[0] == "WrongPattern") {
        this.configUtilityService.errorMessage("Wrong Pattern: select another file");
        return;
      }
      sessionFileName = sessionFileName + "_AI.txt";
      this.router.navigate([ROUTING_PATH + '/auto-discover/auto-instrumentation', sessionFileName]);
    });

  }

  getAIStatus(instance, session) {
    //Combining instance and session name with #
    instance = instance + "#" + session
    this.configTopologyService.getAIStatus(instance).subscribe(data => {
      if (data["_body"] == "complete") {
        this.configUtilityService.infoMessage("Auto-Instrumentation completed")
        this.configTopologyService.updateAIDetails().subscribe(data => {
          this.checkForCompleteOrActive(data);
          this.configHomeService.AIStartStopOpertationValueList(false);
        })
      }
      else {
        this.autoIntrActive[0].elapsedTime = data["_body"];
      }
    })
  }

  downloadFile(instance, session) {
    let data = instance + "|" + sessionStorage.getItem("isTrNumber") + "|" + session
    this.configTopologyService.downloadFile(data).subscribe(data => {
      if (data['_body'] == "Error")
        this.configUtilityService.errorMessage("Error while downloading files")
      else
        this.configUtilityService.successMessage("File downloaded successfully");
    })
  }

  delete(sessionName, instanceName) {
    let that = this;
    this.configTopologyService.deleteAI(sessionName + "#" + instanceName).subscribe(data => {
      this.configUtilityService.infoMessage("Deleted successfully");
      this.configTopologyService.updateAIDetails().subscribe(data => {
        that.checkForCompleteOrActive(data)
      })
    })
  }

  redirectGuiAIToInstance() {
    let dcId;
    let testRunNo = sessionStorage.getItem("isTrNumber");
    this.configTopologyService.getTopologyDCID(testRunNo).subscribe(data => {
      dcId = data._body;
     
      sessionStorage.setItem("showserverinstance", "true");
      this.configApplicationService.getApplicationList().subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].dcId.toString() == dcId)
          {
            this.configApplicationService.applicationNameObserver(data[i].appName)
            this.router.navigate([ROUTING_PATH + '/tree-main/' + dcId]);
          }
        }
      });
    })
  }
}
