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
  selectedAutoIntrComplete: AutoIntrDTO;

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
      if (data[i].status == "complete")
        autoIntrComplete.push(data[i])
      else
        autoIntrActive.push(data[i])
    }
    this.autoIntrComplete = autoIntrComplete;
    this.autoIntrActive = autoIntrActive;
  }

  //To stop auto-insrumentation
  stopInstrumentation(instanceName, sessionName) {
    let that = this;
    console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
    let strSetting = "";
    //if test is offline mode, return (no run time changes)
    if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null) {
      console.log(this.className, "constructor", "No NO RUN TIme Changes");
      this.configUtilityService.errorMessage("Test is not running")
      return;
    }
    else {
      //Getting keywords data whose values are different from default values
      console.log(this.className, "constructor", "MAKING RUNTIME CHANGES this.nodeData");
      const url = `${URL.RUNTIME_CHANGE_AUTO_INSTR}`;
      strSetting = "enableAutoInstrSession=0;"
      //Merging configuration and instance name with #
      strSetting = strSetting + "#" + instanceName;

      //Saving settings in database
      this.configTopologyService.sendRTCTostopAutoInstr(url, strSetting, instanceName, sessionName, function (data) {
        that.checkForCompleteOrActive(data);
      })

    }

  }

  openGUIForAutoInstrumentation(sessionFileName) {
    sessionFileName = sessionFileName + ".txt";
    this.configTopologyService.getSessionFileExistOrNot(sessionFileName).subscribe(data => {

      if (data['_body'] == "Fail") {
        this.configUtilityService.errorMessage("Session file is not there, firstly download this file.");
        return;
      }

      this.router.navigate([ROUTING_PATH + '/auto-discover/auto-instrumentation', sessionFileName]);
    });

  }

  getAIStatus(instance) {
    this.configTopologyService.getAIStatus(instance).subscribe(data => {
    })
  }

  downloadFile(instance, session){
    let data = instance + "|" + sessionStorage.getItem("isTrNumber") + "|" + session
    this.configTopologyService.downloadFile(data).subscribe(data => {
    })
  }


}