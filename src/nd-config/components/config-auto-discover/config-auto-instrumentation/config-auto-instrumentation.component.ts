import { Component, OnInit } from '@angular/core';
import { AutoIntrDTO } from '../../../interfaces/topology-info';
import { ConfigTopologyService } from '../../../services/config-topology.service';
import { ConfigHomeService } from '../../../services/config-home.service';
import * as URL from '../../../constants/config-url-constant';


@Component({
  selector: 'app-config-auto-instrumentation',
  templateUrl: './config-auto-instrumentation.component.html'
//   styleUrls: ['./config-auto-instrumentation.component.css']
})
export class ConfigAutoInstrumentationComponent implements OnInit {

  /* To show Active Auto instrumentation list */
  autoIntrActive: AutoIntrDTO[] = [];
  selectedAutoIntrActive: AutoIntrDTO;

  /* To show Complete auto instrumented list */
  autoIntrComplete: AutoIntrDTO[] = [];
  selectedAutoIntrComplete: AutoIntrDTO;

  className: string = "Auto Instrument Component";

  constructor(private configTopologyService: ConfigTopologyService,
    private configHomeService: ConfigHomeService
  ) { }

  ngOnInit() {
    let that = this;
    this.configTopologyService.getAIData().subscribe(data => {
      //Checking is auto instrumentation is in running state or complete
      this.checkForCompleteOrActive(data)
    })

  }

  //Updating Active and Complete tables
  checkForCompleteOrActive(data){
    let autoIntrComplete =[];
    let autoIntrActive =[];
    for(let i=0;i< data.length; i++){  
      if(data[i].status == "complete")
        autoIntrComplete.push(data[i])
      else
        autoIntrActive.push(data[i])
    }
    this.autoIntrComplete = autoIntrComplete;
    this.autoIntrActive = autoIntrActive;
  }

  //To stop auto-insrumentation
  stopInstrumentation(instanceName){
    console.log(this.className, "constructor", "this.configHomeService.trData.switch", this.configHomeService.trData);
    let strSetting = "";
    //if test is offline mode, return (no run time changes)
    if (this.configHomeService.trData.switch == false || this.configHomeService.trData.status == null) {
      console.log(this.className, "constructor", "No NO RUN TIme Changes");
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
       let data = this.configTopologyService.sendRTCTostopAutoInstr(url, strSetting, instanceName)
       this.checkForCompleteOrActive(data);

    }

  }

}