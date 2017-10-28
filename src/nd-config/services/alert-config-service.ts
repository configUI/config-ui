import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CavTopPanelNavigationService } from '../services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';

@Injectable()
export class AlertConfigService
{
  private clientConnectionKey = "";
  private graphTimeLabel="Last 4 Hours"
  private activeAlertType = "Capacity";
  private activeSeverityType = "All";
  private moduleName = "active";
  private alertCounterClicked = new Subject<any>();
  alertCounterClicked$ = this.alertCounterClicked.asObservable();
  private runningTRNum = -1;
  private alertGraphUrl: string;
  
  constructor(private _navService: CavTopPanelNavigationService, private _router: Router) { }
  
  /** This method is used to show alert graph data in dashboard */
  setAlertGraphsData(urlGraphData: any)
  {
    this.alertGraphUrl = urlGraphData;
    this._navService.addNewNaviationLink('dashboard');
    this._navService.activateNavigationLink('dashboard');
    this._router.navigate(['/home/dashboard/favoritePanel']);
  }

  setAlertCounterValue(alertType: string, severityType: string)
  {
    this.activeAlertType = alertType;
    this.activeSeverityType = severityType;
    let reqObj = {};
    reqObj["type"] = alertType;
    reqObj["severity"] = severityType;

    this.alertCounterClicked.next(reqObj);
  }
  
  public get $clientConnectionKey(): string
  { 
    return this.clientConnectionKey;
  }
  public set $clientConnectionKey(value: string)
  { 
    this.clientConnectionKey = value;    
  }

  public get $graphTimeLabel(): string
  {
    return this.graphTimeLabel;
  }
  public set $graphTimeLabel(value: string)
  {
    this.graphTimeLabel = value;
  }
  
  public get $activeAlertType(): string 
  { 
    return this.activeAlertType;
  }
  public set $activeAlertType(value: string)
  { 
    this.activeAlertType = value;
  }

  public get $activeSeverityType(): string
  {
    return this.activeSeverityType;
  }
  public set $activeSeverityType(value: string)
  { 
    this.activeSeverityType = value;
  }

  public get $moduleName(): string
  { 
    return this.moduleName;
  }
  public set $moduleName(value: string)
  { 
    this.moduleName = value;
  }

  public get $runningTestRunNum() : number
  {
    return this.runningTRNum;
  }  
  public set $runningTestRunNum(value: number)
  {
    this.runningTRNum = value;
  }

  public get $alertGraphUrl(): string
  { 
    return this.alertGraphUrl;
  }
  public set $alertGraphUrl(value: string)
  { 
    this.alertGraphUrl = value;    
  }
 
}
