import { Component, OnInit } from '@angular/core';
import { AutoIntrDTO } from '../../../interfaces/topology-info';
import { ConfigTopologyService } from '../../../services/config-topology.service';
import { ConfigHomeService } from '../../../services/config-home.service';
import { ConfigUtilityService } from '../../../services/config-utility.service';
import * as URL from '../../../constants/config-url-constant';
import { Router } from '@angular/router';
import { ROUTING_PATH } from '../../../constants/config-url-constant';



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

  className: string = "Auto Instrument Component";

  constructor(private configTopologyService: ConfigTopologyService, private router: Router, private configUtilityService: ConfigUtilityService,
    private configHomeService: ConfigHomeService
  ) { }

  ngOnInit() {
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
    sessionFileName = sessionFileName + "_AI.txt";
    this.configTopologyService.getSessionFileExistOrNot(sessionFileName).subscribe(data => {

      if (data['_body'] == "Fail") {
        this.configUtilityService.errorMessage("Session file does not exists. Download it ");
        return;
      }
      else if (data['_body'] == "Empty") {
        this.configUtilityService.errorMessage("Session file is empty.");
        return;
      }
      else if (data['_body'] == "WrongPattern") {
        this.configUtilityService.errorMessage("Wrong Pattern: select another file");
        return;
      }

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
      this.configUtilityService.successMessage("File downloaded successfully");
    })
  }

  delete(sessionName, instanceName) {
    let that =this;
    this.configTopologyService.deleteAI(sessionName + "#" + instanceName).subscribe(data => {
      this.configUtilityService.infoMessage("Deleted successfully");
      this.configTopologyService.updateAIDetails().subscribe(data => {
        that.checkForCompleteOrActive(data)
      })
    })
  }

}